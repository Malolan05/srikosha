import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { Category } from "@/lib/types"

interface CategoryGridProps {
  categories: Category[]
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {categories.map((category) => (
        <Card key={category.slug} className="overflow-hidden group flex flex-col">
          <CardHeader className="pb-3 text-left flex-none">
            <CardTitle className="text-lg sm:text-xl">{category.name}</CardTitle>
            <CardDescription className="text-sm sm:text-base line-clamp-2">{category.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div
              className="h-32 sm:h-40 rounded-md bg-muted/60 mb-3 sm:mb-4 overflow-hidden"
              style={{
                backgroundImage: `url(/placeholder.svg?height=200&width=300)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <p className="text-sm text-muted-foreground line-clamp-3">{category.longDescription}</p>
          </CardContent>
          <CardFooter className="mt-auto pt-4">
            <Button asChild className="w-full group-hover:bg-primary/90 transition-colors">
              <Link href={`/${category.slug}`}>
                <span>Explore {category.name}</span>
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

