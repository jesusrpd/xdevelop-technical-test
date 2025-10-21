import { usePostsUserStroe } from "@/store/Posts";
import { useQuery } from "@tanstack/react-query"
import axios from "axios";

const fetchPosts = async(user: string)=>{
  const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${user}`)
  console.log(response.data);
  return response.data
}

export const usePosts = (user: string)=> {
  const setPosts = usePostsUserStroe(state => state.setPosts)

  return useQuery({
    queryKey: ["postsUser"], 
    queryFn: ()=>fetchPosts(user),
    enabled: true,
    select: (data) => {
      setPosts(data)
      return data
    }
  })
}