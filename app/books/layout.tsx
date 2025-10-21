import Navbar from "@/components/layout/navBar"

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      <Navbar/>
      <main>{children}</main>
    </section>
  )
}