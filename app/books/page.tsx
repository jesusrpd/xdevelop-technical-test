"use client"

import { Skeleton } from "@radix-ui/themes"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState, useEffect } from "react"

type Book = {
  key: string
  title: string
  author_name?: string[]
  first_publish_year?: number
}

type BookDetails = {
  title: string
  authors?: { name: string }[]
  publish_date?: string
  number_of_pages?: number
  subjects?: string[]
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [numFound, setNumFound] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [pageIndex, setPageIndex] = useState(0)

  const [search, setSearch] = useState("")
  const [filterByAuthor, setFilterByAuthor] = useState(false)
  const [author, setAuthor] = useState("")
  const [filterByYear, setFilterByYear] = useState(false)
  const [year, setYear] = useState("")

  const [availableYears, setAvailableYears] = useState<number[]>([])
  const [selectedBookDetails, setSelectedBookDetails] = useState<BookDetails | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchBooks = async (search: string, page: number, size: number) => {
    const response = await axios.get(
      `https://openlibrary.org/search.json?q=${search.replace(/ /g, "+")}&page=${
        page + 1
      }&limit=${size}`
    )
    const docs = response.data.docs
    setBooks(docs)
    setNumFound(response.data.num_found)

    const years = Array.from(
      new Set(docs.map((book: Book) => book.first_publish_year).filter(Boolean))
    ).sort((a:any, b:any) => a - b)
    setAvailableYears(years as number[])
  }

  const mutation = useMutation({
    mutationFn: ({ search, page, size }: { search: string; page: number; size: number }) =>
    fetchBooks(search, page, size),
  })
  const {isLoading} = useQuery({queryKey: ["books"], queryFn: async (bookKey)=>{
      const response = await axios.get(`https://openlibrary.org${bookKey}.json`)
      setSelectedBookDetails(response.data)
      setModalOpen(true)    
  }})
  const fetchBookDetails = async (bookKey: string) => {
    try {
      const response = await axios.get(`https://openlibrary.org${bookKey}.json`)
      setSelectedBookDetails(response.data)
      setModalOpen(true)
    } catch (error) {
      console.error("Error al obtener detalles del libro:", error)
    }
  }

  useEffect(() => {
    if (search.trim() !== "") {
      mutation.mutate({ search, page: pageIndex, size: pageSize })
    }
  }, [search, pageIndex, pageSize])

  useEffect(() => {
    let filtered = books
    if (filterByAuthor && author.trim() !== "") {
      const searchLower = author.toLowerCase()
      filtered = filtered.filter((book) =>
        book.author_name?.some((a) => a.toLowerCase().includes(searchLower))
      )
    }

    if (filterByYear && year !== "") {
      filtered = filtered.filter(
        (book) => book.first_publish_year?.toString() === year
      )
    }

    setFilteredBooks(filtered)
  }, [books, author, year, filterByAuthor, filterByYear])

  return (
    <div className="w-full min-h-screen p-4">
      <h2 className="text-lg font-bold mb-2">Libros</h2>

      {/* Búsqueda principal */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Buscar libro..."
          className="border rounded px-2 py-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setPageIndex(0)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Buscar
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filterByAuthor}
            onChange={(e) => setFilterByAuthor(e.target.checked)}
          />
          Filtrar por autor
        </label>
        {filterByAuthor && (
          <input
            type="text"
            placeholder="Nombre del autor..."
            className="border rounded px-2 py-1"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        )}

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filterByYear}
            onChange={(e) => setFilterByYear(e.target.checked)}
          />
          Filtrar por año
        </label>
        {filterByYear && (
          <select
            className="border rounded px-2 py-1"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="" className="bg-black">Todos los años</option>
            {availableYears.map((y) => (
              <option key={y} value={y} className="bg-black">
                {y}
              </option>
            ))}
          </select>
        )}
      </div>

      {mutation.isPending ? (
        <div>Buscando...</div>
      ) : mutation.isError ? (
        <div>Ocurrió un error: {(mutation.error as Error).message}</div>
      ) : (
        <>
          {mutation.isSuccess && (
            <>
              <div className="mb-2">
                Resultados encontrados: <strong>{numFound.toLocaleString()}</strong>
              </div>

              {/* Grid de tarjetas */}
              <Skeleton loading={isLoading}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredBooks.map((book) => (
                  <div
                    key={book.key}
                    className="border rounded p-4 shadow hover:shadow-lg transition cursor-pointer"
                    onClick={() => fetchBookDetails(book.key)}
                  >
                    <h3 className="font-bold mb-1">{book.title}</h3>
                    <p className="text-sm">
                      Autor: {book.author_name?.join(", ") ?? "Desconocido"}
                    </p>
                    <p className="text-sm">
                      Año: {book.first_publish_year ?? "Desconocido"}
                    </p>
                  </div>
                ))}
              </div>
              </Skeleton>

              {/* Paginación */}
              <div className="flex justify-center gap-3 items-center mt-4 flex-wrap">
                <button
                  onClick={() => setPageIndex(0)}
                  disabled={pageIndex === 0}
                  className="px-2 py-1 border rounded disabled:opacity-50"
                >
                  ⏮ Primera
                </button>
                <button
                  onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                  disabled={pageIndex === 0}
                  className="px-2 py-1 border rounded disabled:opacity-50"
                >
                  ◀ Anterior
                </button>
                <span>
                  Página <strong>{pageIndex + 1} de {Math.ceil(numFound / pageSize)}</strong>
                </span>
                <button
                  onClick={() =>
                    setPageIndex((p) =>
                      Math.min(Math.ceil(numFound / pageSize) - 1, p + 1)
                    )
                  }
                  disabled={pageIndex >= Math.ceil(numFound / pageSize) - 1}
                  className="px-2 py-1 border rounded disabled:opacity-50"
                >
                  Siguiente ▶
                </button>
                <button
                  onClick={() => setPageIndex(Math.ceil(numFound / pageSize) - 1)}
                  disabled={pageIndex >= Math.ceil(numFound / pageSize) - 1}
                  className="px-2 py-1 border rounded disabled:opacity-50"
                >
                  Última ⏭
                </button>

                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value))
                    setPageIndex(0)
                  }}
                  className="border rounded px-2 py-1"
                >
                  {[10, 20, 50, 100].map((size) => (
                    <option key={size} value={size} className="bg-black">
                      {size} por página
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </>
      )}

      {/* Modal de detalles */}
      {modalOpen && selectedBookDetails && (
        <div className="fixed inset-0 bg-black/80  flex justify-center items-center z-50">
          <div className="bg-amber-950 rounded p-6 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setModalOpen(false)}
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-2">{selectedBookDetails.title}</h2>
            <p><strong>Autores:</strong> {selectedBookDetails.authors?.map(a => a.name).join(", ") ?? "Desconocido"}</p>
            <p><strong>Fecha de publicación:</strong> {selectedBookDetails.publish_date ?? "Desconocido"}</p>
            <p><strong>Páginas:</strong> {selectedBookDetails.number_of_pages ?? "Desconocido"}</p>
            {selectedBookDetails.subjects && (
              <p><strong>Temas:</strong> {selectedBookDetails.subjects.join(", ")}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
