import { Metadata } from "next"
import { connectToDatabase } from "@/lib/mongodb"
import { Partner } from "@/lib/models/partner"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { Markdown } from "@/components/markdown"

export const metadata: Metadata = {
  title: "Partners - AquaList",
  description: "Discover the organizations and communities that partner with AquaList to bring you the best Discord bot directory experience.",
}

async function getPartners() {
  const { db } = await connectToDatabase()
  return await db.collection("partners").find({}).sort({ featured: -1, name: 1 }).toArray()
}

export default async function PartnersPage() {
  const partners = await getPartners()
  const featuredPartners = partners.filter((partner: Partner) => partner.featured)
  const regularPartners = partners.filter((partner: Partner) => !partner.featured)

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Partners</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We're proud to work with these amazing organizations and communities to bring you the best Discord bot directory experience.
        </p>
      </div>

      {featuredPartners.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="mr-2">Featured Partners</span>
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
              Featured
            </Badge>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPartners.map((partner: Partner) => (
              <PartnerCard key={partner._id.toString()} partner={partner} />
            ))}
          </div>
        </div>
      )}

      {regularPartners.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Partners</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPartners.map((partner: Partner) => (
              <PartnerCard key={partner._id.toString()} partner={partner} />
            ))}
          </div>
        </div>
      )}

      {partners.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No partners yet. Check back soon!</p>
        </div>
      )}
      
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Interested in Partnering with Us?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          If you run a Discord server, bot list, or other community that would benefit from partnering with AquaList, we'd love to hear from you!
        </p>
        <Link href="/contact">
          <Button size="lg">
            Contact Us About Partnerships
          </Button>
        </Link>
      </div>
    </div>
  )
}

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col border-border/50 transition-all hover:shadow-md hover:border-primary/20">
      <CardHeader className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center gap-4">
          <Image
            src={partner.image || "/placeholder-partner.png"}
            alt={partner.name}
            width={64}
            height={64}
            className="rounded-full object-cover border-2 border-background"
          />
          <div>
            <CardTitle className="text-xl">
              {partner.name}
            </CardTitle>
            <CardDescription className="line-clamp-1">
              <a href={partner.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {new URL(partner.url).hostname}
              </a>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow flex flex-col">
        <div className="prose prose-sm dark:prose-invert mb-6 flex-grow">
          <Markdown content={partner.description} />
        </div>
        
        <a 
          href={partner.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-full"
        >
          <Button variant="outline" className="w-full">
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit {partner.name}
          </Button>
        </a>
      </CardContent>
    </Card>
  )
} 