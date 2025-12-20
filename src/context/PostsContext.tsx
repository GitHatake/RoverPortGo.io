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
        const fetchAllData = async () => {
            try {
                setLoading(true);
                // Fetch a large batch once
                const response = await axios.get<Post[]>(
                    'https://roverport.rcjweb.jp/wp-json/wp/v2/posts?_embed&per_page=100'
                );
                const fetchedPosts = response.data;
                setPosts(fetchedPosts);

                // Derive Authors
                const uniqueAuthors = new Map<number, WPAuthor>();
                fetchedPosts.forEach(post => {
                    const author = post._embedded?.author?.[0];
                    if (author && !uniqueAuthors.has(author.id)) {
                        uniqueAuthors.set(author.id, author);
                    }
                });
                setAuthors(Array.from(uniqueAuthors.values()));

                // Derive Tags
                const uniqueTags = new Map<number, WPTerm>();
                fetchedPosts.forEach(post => {
                    const terms = post._embedded?.['wp:term']?.flat() || [];
                    terms.forEach((term: WPTerm) => {
                        if (term.taxonomy === 'post_tag' && !uniqueTags.has(term.id)) {
                            uniqueTags.set(term.id, term);
                        }
                    });
                });
                setTags(Array.from(uniqueTags.values()));

            } catch (err) {
                setError('Failed to fetch posts');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
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
