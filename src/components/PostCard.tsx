import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { User, Calendar, Tag } from 'lucide-react';
import type { Post, WPTerm } from '../types';
import { decodeHTML, stripTags } from '../utils';

interface PostCardProps {
    post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
    const author = post._embedded?.author?.[0];
    const terms = post._embedded?.['wp:term']?.flat() || [];
    const tags = terms.filter((term: WPTerm) => term.taxonomy === 'post_tag');
    const imageUrl = featuredMedia?.source_url;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100 dark:border-gray-700"
        >
            <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={featuredMedia?.alt_text || post.title.rendered}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800">
                        <span className="text-4xl">📷</span>
                    </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 flex-wrap justify-end">
                    {tags.slice(0, 2).map(tag => (
                        <span key={tag.id} className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <Tag size={10} />
                            {tag.name}
                        </span>
                    ))}
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2 leading-tight">
                    <a href={post.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {decodeHTML(post.title.rendered)}
                    </a>
                </h2>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">
                    {stripTags(post.excerpt.rendered)}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        {author?.avatar_urls?.['48'] && (
                            <img src={author.avatar_urls['48']} alt={author.name} className="w-6 h-6 rounded-full" />
                        )}
                        <span className="flex items-center gap-1">
                            <User size={12} />
                            {author?.name || 'Unknown'}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {format(new Date(post.date), 'MMM d, yyyy')}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
