import { Button } from "@/components/ui/button"
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-2">
          <h1 className="text-9xl font-black text-primary">404</h1>
          <h2 className="text-3xl font-bold tracking-tight">Page not found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            We couldn&apos;t find the page you&apos;re looking for. Please check the URL or return home.
          </p>
        </div>
        
        <Button asChild size="lg">
          <Link href="/">
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  )
}