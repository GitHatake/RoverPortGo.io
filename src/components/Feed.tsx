import React, { useState } from 'react';
import { usePosts } from '../hooks/usePosts';
import { useAttributes } from '../hooks/useAttributes';
import { PostCard } from './PostCard';
import { FilterBar } from './FilterBar';
import { Loader2, AlertCircle } from 'lucide-react';
import type { PostFilter } from '../types/filters';

export const Feed: React.FC = () => {
    const [filter, setFilter] = useState<PostFilter>({
        per_page: 20,
        orderby: 'date',
        order: 'desc',
    });

    const { posts, loading, error } = usePosts(filter);
    const { authors, tags } = useAttributes();

    return (
        <div className="max-w-7xl mx-auto px-6">
            <FilterBar
                authors={authors}
                tags={tags}
                filter={filter}
                onFilterChange={setFilter}
            />

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin text-blue-500" size={48} />
                </div>
            ) : error ? (
                <div className="flex justify-center items-center py-20 text-red-500 gap-2">
                    <AlertCircle size={24} />
                    <span>{error}</span>
                </div>
            ) : posts.length === 0 ? (
                <div className="flex flex-col justify-center items-center py-20 text-gray-500">
                    <span className="text-4xl mb-2">📭</span>
                    <p>No posts found matching your filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
};
