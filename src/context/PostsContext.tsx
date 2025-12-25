import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import type { Post, WPAuthor, WPTerm } from '../types';

interface PostsContextType {
    posts: Post[];
    authors: WPAuthor[];
    tags: WPTerm[];
    loading: boolean;
    error: string | null;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [authors, setAuthors] = useState<WPAuthor[]>([]);
    const [tags, setTags] = useState<WPTerm[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCache = (): boolean => {
            const cachedPosts = localStorage.getItem('rp_posts_cache');
            if (cachedPosts) {
                try {
                    const parsed = JSON.parse(cachedPosts);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setPosts(parsed);
                        // Also derive attributes from cache immediately
                        deriveAndSetAttributes(parsed);
                        setLoading(false); // Show content immediately!
                        console.log("Loaded posts from cache.");
                        return true;
                    }
                } catch (e) {
                    console.warn("Invalid cache", e);
                }
            }
            return false;
        };

        const deriveAndSetAttributes = (postsData: Post[]) => {
            // Derive Authors
            const uniqueAuthors = new Map<number, WPAuthor>();
            postsData.forEach(post => {
                const author = post._embedded?.author?.[0];
                if (author && !uniqueAuthors.has(author.id)) {
                    uniqueAuthors.set(author.id, author);
                }
            });
            setAuthors(Array.from(uniqueAuthors.values()));

            // Derive Tags
            const uniqueTags = new Map<number, WPTerm>();
            postsData.forEach(post => {
                const terms = post._embedded?.['wp:term']?.flat() || [];
                terms.forEach((term: WPTerm) => {
                    if (term.taxonomy === 'post_tag' && !uniqueTags.has(term.id)) {
                        uniqueTags.set(term.id, term);
                    }
                });
            });
            setTags(Array.from(uniqueTags.values()));
        };

        const fetchFreshData = async (hasCache: boolean) => {
            try {
                // If no cache was loaded, we must show loading spinner
                if (!hasCache) {
                    setLoading(true);
                }

                // Fetch a large batch once
                const response = await axios.get<Post[]>(
                    'https://roverport.rcjweb.jp/wp-json/wp/v2/posts?_embed&per_page=100'
                );
                const fetchedPosts = response.data;

                // Update state and cache
                setPosts(fetchedPosts);
                deriveAndSetAttributes(fetchedPosts);
                localStorage.setItem('rp_posts_cache', JSON.stringify(fetchedPosts));
                console.log("Fetched fresh posts.");

            } catch (err) {
                // If we have cache, an error is fine, just log it. 
                // If we don't have cache, we should show error.
                if (!hasCache) {
                    setError('Failed to fetch posts');
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const hasCache = loadCache();
        fetchFreshData(hasCache);
    }, []);

    return (
        <PostsContext.Provider value={{ posts, authors, tags, loading, error }}>
            {children}
        </PostsContext.Provider>
    );
};

export const usePostsContext = () => {
    const context = useContext(PostsContext);
    if (context === undefined) {
        throw new Error('usePostsContext must be used within a PostsProvider');
    }
    return context;
};
