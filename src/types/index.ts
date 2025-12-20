export interface RenderedContent {
    rendered: string;
}

export interface WPMediaDetails {
    sizes: {
        medium?: { source_url: string };
        large?: { source_url: string };
        full?: { source_url: string };
        [key: string]: { source_url: string } | undefined;
    };
}

export interface WPFeaturedMedia {
    id: number;
    source_url: string;
    media_details: WPMediaDetails;
    alt_text: string;
}

export interface WPAuthor {
    id: number;
    name: string;
    link: string;
    avatar_urls: { [key: string]: string };
}

export interface WPTerm {
    id: number;
    name: string;
    link: string;
    taxonomy: string;
}

export interface Embedded {
    'wp:featuredmedia'?: WPFeaturedMedia[];
    author?: WPAuthor[];
    'wp:term'?: WPTerm[][];
}

export interface Post {
    id: number;
    date: string;
    link: string;
    title: RenderedContent;
    content: RenderedContent;
    excerpt: RenderedContent;
    _embedded?: Embedded;
}
