// ==========================================
// 設定項目 (ここを書き換えてください)
// ==========================================
const SHEET_ID = 'ここにスプレッドシートID';
// Service Account JSONの中身を以下に転記してください
const PROJECT_ID = 'ここに project_id (例: roverportgo)';
const CLIENT_EMAIL = 'ここに client_email';
const PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n'; // 改行はそのままでOK

// ==========================================
// エンドポイント: トークン登録 (アプリから呼ばれる)
// ==========================================
function doPost(e) {
    try {
        const params = JSON.parse(e.postData.contents);
        const token = params.token;

        if (!token) {
            return responseJSON({ status: 'error', message: 'No token' });
        }

        const ss = SpreadsheetApp.openById(SHEET_ID);
        const sheet = ss.getSheets()[0];
        // 重複チェック (簡易版)
        const data = sheet.getDataRange().getValues();
        const exists = data.some(row => row[0] === token);

        if (!exists) {
            sheet.appendRow([token, new Date()]);
        }

        return responseJSON({ status: 'success', saved: true });
    } catch (err) {
        return responseJSON({ status: 'error', message: err.toString() });
    }
}

function responseJSON(data) {
    return ContentService.createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
}

// ==========================================
// トリガー実行: 新着チェック & 通知送信
// ==========================================
function checkNewPosts() {
    const props = PropertiesService.getScriptProperties();
    const lastCheck = props.getProperty('LAST_CHECK_TIME');

    if (!lastCheck) {
        props.setProperty('LAST_CHECK_TIME', new Date().toISOString());
        return;
    }

    // WordPressから最新記事取得
    const url = 'https://roverport.rcjweb.jp/wp-json/wp/v2/posts?per_page=1&_embed';
    const response = UrlFetchApp.fetch(url);
    const posts = JSON.parse(response.getContentText());

    if (posts.length === 0) return;
    const latestPost = posts[0];
    const postTime = latestPost.date_gmt + 'Z';

    // 時刻比較
    if (new Date(postTime).getTime() > new Date(lastCheck).getTime()) {
        sendPushNotification(latestPost);
        props.setProperty('LAST_CHECK_TIME', new Date().toISOString());
    }
}

// ==========================================
// FCM HTTP v1 API で送信
// ==========================================
function sendPushNotification(post) {
    // トークン取得
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheets()[0];
    const data = sheet.getDataRange().getValues();
    const tokens = data.map(row => row[0]).filter(t => t && t.length > 10); // 簡易バリデーション

    if (tokens.length === 0) return;

    const accessToken = getAccessToken();
    if (!accessToken) {
        Logger.log('Auth failed');
        return;
    }

    // 本文からHTMLタグ除去して短縮
    const bodyText = (post.excerpt?.rendered || '').replace(/<[^>]+>/g, '').substring(0, 100) + '...';

    // v1 APIは1リクエスト1トークン推奨だが、GASの制限回避のため並列処理はせずループ送信するか、
    // トピック送信を使うのが一般的。しかし今回は全ユーザー送信なのでループで送る。
    // (人数が多い場合はトピック購読の実装を推奨)

    const url = `https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`;

    tokens.forEach(token => {
        const payload = {
            message: {
                token: token,
                notification: {
                    title: '新着: ' + post.title.rendered,
                    body: bodyText
                },
                webpush: {
                    headers: {
                        Urgency: "high"
                    },
                    notification: {
                        icon: 'https://githatake.github.io/RoverPortGo.io/pwa-192x192.png',
                        click_action: 'https://githatake.github.io/RoverPortGo.io/'
                    },
                    fcm_options: {
                        link: 'https://githatake.github.io/RoverPortGo.io/'
                    }
                }
            }
        };

        const options = {
            method: 'post',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            payload: JSON.stringify(payload),
            muteHttpExceptions: true
        };

        try {
            const resp = UrlFetchApp.fetch(url, options);
            Logger.log('Sent to ' + token + ': ' + resp.getResponseCode());
        } catch (e) {
            Logger.log('Error: ' + e);
        }
    });
}

// ==========================================
// OAuth 2.0 アクセストークン取得 (JWT生成)
// ==========================================
function getAccessToken() {
    const header = {
        alg: "RS256",
        typ: "JWT"
    };

    const now = Math.floor(Date.now() / 1000);
    const claim = {
        iss: CLIENT_EMAIL,
        scope: "https://www.googleapis.com/auth/firebase.messaging",
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now
    };

    const signatureInput = Utilities.base64EncodeWebSafe(JSON.stringify(header)) + "." +
        Utilities.base64EncodeWebSafe(JSON.stringify(claim));

    const signature = Utilities.computeRsaSha256Signature(
        signatureInput,
        PRIVATE_KEY
    );

    const jwt = signatureInput + "." + Utilities.base64EncodeWebSafe(signature);

    const payload = {
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt
    };

    const options = {
        method: "post",
        payload: payload,
        muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch("https://oauth2.googleapis.com/token", options);
    const json = JSON.parse(response.getContentText());

    if (json.access_token) {
        return json.access_token;
    } else {
        Logger.log("Token Error: " + response.getContentText());
        return null;
    }
}
