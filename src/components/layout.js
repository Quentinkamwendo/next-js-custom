import Nav from "@/components/nav";
import Footer from "@/components/footer"

export default function Layout({children}) {
    return (
        <div>
            <Nav />
            <main>{children}</main>
            <Footer />
        </div>
    )
}