import type { Metadata } from "next";
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
import { SITE_CONFIG } from "./lib/site-config";

export const metadata: Metadata = {
  title: "THOUGHTAKEN | Official Site",
  description:
    "Official THOUGHTAKEN site featuring motorcycle videos, rider culture, social links, and limited merch drops.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "THOUGHTAKEN official",
    "@thoughtaken",
    "motorcycle videos",
    "biker content",
    "motorcycle merch",
    "join movement",
  ],
};

export default function Home() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "THOUGHTAKEN",
    url: "https://thoughtaken.com",
    description:
      "Motorcycle rides, stories, and community from THOUGHTAKEN.",
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SubscribeAction",
      target: SITE_CONFIG.links.subscribe,
      name: "Subscribe on YouTube",
    },
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_CONFIG.branding.creatorName,
    alternateName: "THOUGHTAKEN",
    url: "https://thoughtaken.com",
    sameAs: SITE_CONFIG.socials
      .filter((social) => social.enabled)
      .map((social) => social.href),
    jobTitle: "Motorcycle Creator",
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "THOUGHTAKEN",
    url: "https://thoughtaken.com",
    logo: "https://thoughtaken.com/favicon.png",
    sameAs: SITE_CONFIG.socials
      .filter((social) => social.enabled)
      .map((social) => social.href),
  };

  return (
    <div className="bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
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
