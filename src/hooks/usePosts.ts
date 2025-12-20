import { useState, useEffect } from 'react';
import { usePostsContext } from '../context/PostsContext';
import type { Post } from '../types';
import type { PostFilter } from '../types/filters';

export const usePosts = (filter: PostFilter = {}) => {
    const { posts: allPosts, loading, error } = usePostsContext();
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

    useEffect(() => {
        if (loading || error) return;

        let result = [...allPosts];

        // Filter by Author
        if (filter.author) {
            result = result.filter(post => post._embedded?.author?.[0]?.id === filter.author);
        }

        // Filter by Tag
        if (filter.tag) {
            result = result.filter(post => {
                const terms = post._embedded?.['wp:term']?.flat() || [];
                return terms.some(term => term.taxonomy === 'post_tag' && term.id === filter.tag);
            });
        }

        // Sort
        const order = filter.order || 'desc';
        const isAsc = order === 'asc';

        // Prioritize date sort as requested
        result.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return isAsc ? dateA - dateB : dateB - dateA;
        });

        setFilteredPosts(result);
    }, [allPosts, loading, error, filter.author, filter.tag, filter.orderby, filter.order]);

    return { posts: filteredPosts, loading, error };
};
