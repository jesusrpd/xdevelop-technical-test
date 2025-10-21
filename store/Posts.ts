import {create} from 'zustand'

type PostsUser = {
  id?: number
  title: string
  body: string
  userId: number
}

type postsUserState = {
  posts: PostsUser[]
  setPosts : (posts: PostsUser[]) => void
  addPost: (newPost: PostsUser) => void
}

export const usePostsUserStroe = create<postsUserState>((set) => ({
  posts: [],
  setPosts: posts => set({posts}),
  addPost: new_post =>{
    set(state => {
        const lastId = state.posts.length > 0
          ? Math.max(...state.posts.map((b:any) => b.id))
          : 0;
        
        const postWithId = { id: lastId + 1, ...new_post };
        
        return { posts: [...state.posts, postWithId] };
    })}
}))