import { usePostsContext } from '../context/PostsContext';

export const useAttributes = () => {
    const { authors, tags, loading, error } = usePostsContext();
    return { authors, tags, loading, error };
};
