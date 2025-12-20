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
    const handleChange = (key: keyof PostFilter, value: any) => {
        const newFilter = { ...filter, [key]: value };
        if (!value) delete newFilter[key as keyof PostFilter]; // Remove empty keys
        onFilterChange(newFilter);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-gray-500 mr-2">
                <Filter size={18} />
                <span className="text-sm font-medium">Filters:</span>
            </div>

            {/* Author Select */}
            <div className="relative group">
                <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <select
                    className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 min-w-[150px]"
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

            {/* Tag Select */}
            <div className="relative group">
                <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <select
                    className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 min-w-[150px]"
                    value={filter.tag || ''}
                    onChange={(e) => handleChange('tag', e.target.value ? Number(e.target.value) : undefined)}
                >
                    <option value="">All Tags</option>
                    {tags.map((tag) => (
                        <option key={tag.id} value={tag.id}>
                            {tag.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2 hidden sm:block"></div>

            {/* Sort Order */}
            <div className="relative group ml-auto">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <select
                    className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                    value={filter.order || 'desc'}
                    onChange={(e) => handleChange('order', e.target.value)}
                >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>
            </div>
        </div>
    );
};
