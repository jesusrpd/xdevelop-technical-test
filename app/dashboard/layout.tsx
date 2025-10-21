import Navbar from "@/components/layout/navBar"

export default function DashboardLayout({
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