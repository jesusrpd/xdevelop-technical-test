import { usePostsUserStroe } from "@/store/Posts"

export const usePostById = (id: number)=> {
    const posts = usePostsUserStroe(state => state.posts)
    return posts.find(p => p.id === id)
}