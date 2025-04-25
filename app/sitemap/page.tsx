import { Metadata } from "next"
import Link from "next/link"
import { connectToDatabase } from "@/lib/mongodb"

export const metadata: Metadata = {
  title: "Sitemap - AquaList",
  description: "Browse all pages on AquaList, the ultimate Discord bot directory.",
  robots: {
    index: true,
    follow: true,
  }
}

export default async function SitemapPage() {
  const { db } = await connectToDatabase()
  
  const categories = await db.collection("categories")
    .find({})
    .sort({ name: 1 })
    .toArray()
  
  const topBots = await db.collection("bots")
    .find({ status: "approved" })
    .sort({ votes: -1 })
    .limit(10)
    .toArray()
  
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-4xl font-bold mb-8">Sitemap</h1>
      
      <div className="mb-8">
        <p className="text-muted-foreground">
          This page provides a human-readable overview of all pages on AquaList. For search engines, we also provide an{" "}
          <a href="/sitemap.xml" className="text-primary hover:underline">XML sitemap</a>.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Main Pages</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-primary hover:underline">Home</Link>
            </li>
            <li>
              <Link href="/bots" className="text-primary hover:underline">Explore Bots</Link>
            </li>
            <li>
              <Link href="/users" className="text-primary hover:underline">Bot Developers</Link>
            </li>
            <li>
              <Link href="/submit" className="text-primary hover:underline">Submit a Bot</Link>
            </li>
            <li>
              <Link href="/login" className="text-primary hover:underline">Login</Link>
            </li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Categories</h2>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category._id.toString()}>
                <Link 
                  href={`/bots?category=${category.slug}`} 
                  className="text-primary hover:underline"
                >
                  {category.name} Bots
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Popular Bots</h2>
          <ul className="space-y-2">
            {topBots.map((bot) => (
              <li key={bot._id.toString()}>
                <Link 
                  href={`/bots/${bot.clientId}`} 
                  className="text-primary hover:underline"
                >
                  {bot.name}
                </Link>
              </li>
            ))}
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Legal & Info</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
            </li>
            <li>
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/accessibility" className="text-primary hover:underline">Accessibility</Link>
            </li>
            <li>
              <Link href="/contact" className="text-primary hover:underline">Contact Us</Link>
            </li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Resources</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/docs" className="text-primary hover:underline">API Documentation</Link>
            </li>
            <li>
              <Link href="/docs/getting-started" className="text-primary hover:underline">Getting Started</Link>
            </li>
            <li>
              <a 
                href="/sitemap.xml" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:underline"
              >
                XML Sitemap
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mt-12 p-6 bg-muted rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Dynamic Content</h2>
        <p className="mb-4">
          Our sitemap also includes dynamic content that is updated regularly:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Bot Pages:</strong> Individual pages for each approved bot
          </li>
          <li>
            <strong>User Profiles:</strong> Pages for each registered developer
          </li>
          <li>
            <strong>Category Pages:</strong> Pages for each bot category
          </li>
        </ul>
        <p className="mt-4 text-muted-foreground">
          These pages are automatically included in our <a href="/sitemap.xml" className="text-primary hover:underline">XML sitemap</a> for search engines.
        </p>
      </div>
    </div>
  )
} 