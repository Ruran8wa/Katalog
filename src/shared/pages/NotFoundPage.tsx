import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-3 py-24 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Button className="mt-2" render={<Link to="/" />}>
        Back to shop
      </Button>
    </div>
  )
}
