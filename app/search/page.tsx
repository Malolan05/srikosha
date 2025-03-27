import { Card, CardContent } from "@/components/ui/card"
import { Construction } from "lucide-react"

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Card className="text-center p-12">
          <CardContent className="space-y-6">
            <Construction className="h-16 w-16 mx-auto text-primary" />
            <h1 className="text-3xl font-bold text-primary">We're Still Working on Search</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              We're currently building a powerful search feature to help you find exactly what you're looking for. 
              Check back soon for updates!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

