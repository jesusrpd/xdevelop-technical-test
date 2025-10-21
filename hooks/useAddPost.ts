import { usePostsUserStroe } from "@/store/Posts"

export const useAddPost = (new_post)=> {
    const addPost = usePostsUserStroe(state => state.addPost)
    const posts = usePostsUserStroe(state => state.posts)

        const lastId = posts.length > 0
          ? Math.max(...posts.map((b) => b.id))
          : 0;
        const nextId = lastId + 1;
        
        const postWithId = { id: nextId, ...new_post };
        console.log(postWithId);
        addPost(postWithId)
        return postWithId
    
}