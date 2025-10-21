'use client'
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import Link from "next/link"
import { Box, Card, Text, Flex, Avatar } from '@radix-ui/themes'

export default function Posts(){

    const {isPending , data, isError, error} = useQuery({queryKey: ['usersPosts'], queryFn: async ()=> {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users')
        console.log(response.data);
        return response.data
    }})

    if (isPending) return <span>Loading...</span>

    if (isError) return <span>Eror: {error.message}</span>

    return (
        <div className="bg-gray-900 py-24 sm:py-32 min-h-screen">
        <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:px-8 xl:grid-cols-3">
            <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight text-pretty text-white sm:text-4xl">Posts</h2>
            <p className="mt-6 text-lg/8 text-gray-400">Escoge un usuario para ver sus posts.</p>
            </div>
            <Flex gap="3" wrap="wrap">
            {data.map((user:any) =>(
              <Link href={`/posts/${user.id}`} key={user.id}>
                <Box width="350px">
                  <Card size="1">
                    <Flex gap="3" align="center">
                      <Avatar size="3" radius="full" fallback={user.name[0]} color="teal" />
                      <Box>
                        <Text as="div" size="2" weight="bold">
                          {user.name}
                        </Text>
                        <Text as="div" size="1" weight="light">
                          {user.address.city} | {user.address.street} | {user.address.zipcode}
                        </Text>
                        <Text as="div" size="2" color="teal">
                          Ver posts
                        </Text>
                      </Box>
                    </Flex>
                  </Card>
                </Box>
              </Link>
            ))     
            }
            </Flex>
        </div>
        </div>
    )
}