import React from 'react';
import { Filter, Calendar, Users, Hash } from 'lucide-react';
import type { WPAuthor, WPTerm } from '../types';
import type { PostFilter } from '../types/filters';

interface FilterBarProps {
    authors: WPAuthor[];
    tags: WPTerm[];
    filter: PostFilter;
    onFilterChange: (newFilter: PostFilter) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ authors, tags, filter, onFilterChange }) => {
    const activeTagId = filter.tag;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
            {/* Top Row: Actions */}
            <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-700">
                {/* Author Select (Left) */}
                <div className="relative">
                    <Users size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                        className="pl-8 pr-8 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 max-w-[140px]"
                        value={filter.author || ''}
                        onChange={(e) => handleChange('author', e.target.value ? Number(e.target.value) : undefined)}
                    >
                        <option value="">All Authors</option>
                        {authors.map((author) => (
                            <option key={author.id} value={author.id}>
                                {author.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sort Order (Right) */}
                <div className="relative">
                    <Calendar size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                        className="pl-8 pr-4 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                        value={filter.order || 'desc'}
                        onChange={(e) => handleChange('order', e.target.value)}
                    >
                        <option value="desc">Newest</option>
                        <option value="asc">Oldest</option>
                    </select>
                </div>
            </div>

            {/* Bottom Row: Horizontal Scrollable Tags */}
            <div className="px-3 py-3 overflow-x-auto scrollbar-hide flex items-center gap-2">
                {/* 'All' Chip */}
                <button
                    onClick={() => handleChange('tag', undefined)}
                    className={`
                        flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all
                        ${!activeTagId
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }
                    `}
                >
                    All
                </button>

                {/* Tag Chips */}
                {tags.map((tag) => (
                    <button
                        key={tag.id}
                        onClick={() => handleChange('tag', tag.id)}
                        className={`
                            flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all border
                            ${activeTagId === tag.id
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-400 hover:text-blue-500'
                            }
                        `}
                    >
                        {tag.name}
                    </button>
                ))}
            </div>
        </div>
    );
};
