import { usePostsUserStroe } from "@/store/Posts"

type NewPost = {
  title: string,
  body: string,
  user_id: number
}

export const useAddPost = (new_post: NewPost)=> {
    const addPost = usePostsUserStroe(state => state.addPost)
    const posts = usePostsUserStroe(state => state.posts)

        const lastId = posts.length > 0
          ? Math.max(...posts.map((b:any) => b.id))
          : 0;
        const nextId = lastId + 1;
        
        const postWithId = { id: nextId, userId: 1, ...new_post };
        console.log(postWithId);
        addPost(postWithId)
        return postWithId
    
}