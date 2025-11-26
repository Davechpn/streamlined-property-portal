import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Headline */}
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Streamline Your Property Management
        </h1>

        {/* Description */}
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
          A modern platform for managing properties, teams, and operations. 
          Collaborate seamlessly with role-based access control and powerful administration tools.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="text-base">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-base">
            <Link href="/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
