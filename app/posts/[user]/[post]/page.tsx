"use client"
import { usePostById } from "@/hooks/usePostById"
import { usePostsUserStroe } from "@/store/Posts"
import React, { useEffect } from "react"

export default function PostsUser({params}: {params: Promise<{post: number}>}){
    const {post} = React.use(params)
    
    const post_store = usePostById(Number(post))

    return (
      <div className="w-full min-h-screen p-5">
        <h2 className="text-center font-bold mb-5">{post_store?.title}</h2>
        <p>{post_store?.body.split('\n').map( comment =>(
            <p key={comment}>{comment}</p>
        ))}</p>
      </div>
    )
}