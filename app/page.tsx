import About from "./components/About";
import CTA from "./components/CTA";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Products from "./components/Products";
import Socials from "./components/Socials";
import StatsStrip from "./components/StatsStrip";
import Video from "./components/Video";

export default function Home() {
  return (
    <div className="bg-black text-white">
      <Navbar />
      <main className="no-scrollbar scroll-smooth">
        <Hero />
        <StatsStrip />
        <About />
        <Products />
        <Video />
        <Socials />
        <CTA />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
