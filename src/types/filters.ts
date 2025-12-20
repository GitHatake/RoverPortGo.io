import type { WPAuthor, WPTerm } from '../types';

export interface PostFilter {
    author?: number;
    tag?: number;
    per_page?: number;
    orderby?: 'date' | 'title';
    order?: 'asc' | 'desc';
}

export interface AttributeState {
    authors: WPAuthor[];
    tags: WPTerm[];
    loading: boolean;
    error: string | null;
}
