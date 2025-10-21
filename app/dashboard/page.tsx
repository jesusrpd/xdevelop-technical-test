"use client"
import Link from "next/link";
import { Box, Card, Flex, Text } from '@radix-ui/themes'
import {ArrowRightIcon} from '@radix-ui/react-icons'

export default function Dashboard(){

  return(
    <div className="px-5">
      <h2 className="m-5">Bienvenido Jesús</h2>
      <Flex gap="3" wrap="wrap">
        <Box maxWidth="350px" width="190px">
          <Card asChild>
            <Link href="/users">
              <Text as="div" size="2" weight="bold">
                Usuarios
              </Text>
              <Text as="div" color="teal" size="2">
                Ver página usuarios <ArrowRightIcon/>
              </Text>
            </Link>
          </Card>
        </Box>
        <Box maxWidth="350px" width="190px">
          <Card asChild>
            <Link href="/posts">
              <Text as="div" size="2" weight="bold">
                Posts
              </Text>
              <Text as="div" color="teal" size="2">
                Ver página de posts <ArrowRightIcon/>
              </Text>
            </Link>
          </Card>
        </Box>
        <Box maxWidth="350px" width="190px">
          <Card asChild>
            <Link href="/books">
              <Text as="div" size="2" weight="bold">
                Libros
              </Text>
              <Text as="div" color="teal" size="2">
                Buscar libros <ArrowRightIcon/>
              </Text>
            </Link>
          </Card>
        </Box>
      </Flex>
    </div>
  )
}