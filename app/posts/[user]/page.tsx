"use client"
import ModalPosts from "@/components/components-posts/modalPosts"
import { usePosts } from "@/hooks/usePostsUser"
import { usePostsUserStroe } from "@/store/Posts"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import Link from "next/link"
import React, { use, useEffect, useState } from "react"
import {create} from 'zustand'
import {Button, Dialog, Flex, Text, TextField} from '@radix-ui/themes'
import { title } from "process"
import { useAddPost } from "@/hooks/useAddPost"

type FormPost = {
  title: string,
  body: string,
}

type FormActionPost = {
  updateTitle: (title: FormPost['title']) => void
  updateBody: (body: FormPost['body']) => void
}

const useFormPostStore = create<FormPost & FormActionPost>((set)=> ({
  title: '',
  body: '',
  updateTitle: (title) => set(()=> ({title})),
  updateBody: (body) => set(()=> ({body}))
}))

export default function PostsUser({params}: {params: Promise<{user: string}>}){
    const {user} = React.use(params)

    const {isPending, isError, error, data} = usePosts(user)
    const addPost = usePostsUserStroe(state => state.addPost)
    const posts = usePostsUserStroe(state => state.posts)

    const postForm = {
      title: useFormPostStore(state => state.title),
      body: useFormPostStore(state => state.body),
      updateTitle: useFormPostStore(state => state.updateTitle),
      updateBody: useFormPostStore(state => state.updateBody)
    }

    const createPost = ()=> {
      console.log(postForm.title);
      console.log(postForm.body);
      const new_post = {
        title: postForm.title,
        body: postForm.body,
        userId:Number(user),
        id: 1
      }
      addPost(new_post)
      console.log(posts);
    }

    if(isPending) return <span>Loading...</span>

    if(isError) return <span>Error: {error.message}</span>
    
    return (
      <div className="w-full min-h-screen p-5">
        <h2 className="text-2xl font-bold text-center mb-5">Posts</h2>
        <div>
          <Dialog.Root >
            <Dialog.Trigger>
              <Button m="2">Crear Post</Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="450px">
              <Dialog.Title>Edit profile</Dialog.Title>
              <Dialog.Description size="2" mb="4">
                Si quieres agregar más de un comenario separalos por el caracter "%"
              </Dialog.Description>

              <Flex direction="column" gap="3">
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    Titulo
                  </Text>
                  <TextField.Root
                    placeholder="Indica el titulo del post"
                    onChange={e => postForm.updateTitle(e.currentTarget.value)}
                    value={postForm.title}
                  />
                </label>
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    Comentario
                  </Text>
                  <TextField.Root
                    placeholder="Introduce tus comentarios"
                    onChange={e => postForm.updateBody(e.currentTarget.value)}
                    value={postForm.body}
                  />
                </label>
              </Flex>

              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <button className="Button green">Cancelar</button>
                </Dialog.Close>
                <Dialog.Close>
                  <button className="Button bg-green-600 px-2 rounded-sm py-1" onClick={createPost}>Crear</button>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>       
        </div>
        <hr />
        <div className="flex flex-wrap">
          {posts.map(p =>(
            <div className="card" key={p.id}>
              <h3 className="card-title">{p.title}</h3>
                <Link href={`/posts/user/${p.id}`} className="card-btn">Ver post completo</Link>
            </div>
          ))}
        </div>
      </div>
    )
}