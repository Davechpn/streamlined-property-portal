import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedContent from '../AnimatedContent';
import DotGrid from '@/components/DotGrid';
import Prism from '@/components/Prism';
import LightRays from '@/components/LightRays';

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-16 min-h-[calc(100vh-24rem)]">
      {/* LightRays background */}
      <div className="absolute inset-0 -z-10">
        <LightRays
          raysOrigin="top-center"
          raysColor="#7C3AED"
          raysSpeed={0.5}
          lightSpread={0.8}
          rayLength={1.5}
          pulsating={true}
          fadeDistance={0.8}
          saturation={1.2}
          followMouse={true}
          mouseInfluence={0.05}
          noiseAmount={0.1}
          distortion={0.2}
          className="opacity-30"
        />
      </div>
      
      {/* Additional gradient overlay for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-90"
        style={{ transform: 'translateZ(0)' }}
      />

      <div className="container mx-auto">
        <AnimatedContent
          className="flex flex-col-reverse items-center gap-12 lg:flex-row lg:items-stretch"
          direction="horizontal"
          distance={40}
          threshold={0.2}
          container={null}
        >
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              {/* Hero Headline */}
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Streamline Your Property Management
              </h1>
              
              {/* Hero Description */}
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
                A modern platform for managing properties, teams, and operations.
                Collaborate seamlessly with role-based access control and powerful administration tools.
              </p>
            </div>

         

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="text-base">
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base">
                <Link href="/signin">Sign In</Link>
              </Button>
            </div>
          </div>

          <div className="flex-1 lg:max-w-2xl relative">
            {/* Property Image positioned at bottom of this section */}
            <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 z-10">
              <div className="relative w-[800px] h-[600px]">
                <Image
                  src="/proff_1.png"
                  alt="Property Management Platform Interface"
                  fill
                  sizes="(max-width: 768px) 90vw, 800px"
                  className="object-contain object-center"
                  style={{ objectPosition: 'center bottom' }}
                />
              </div>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}

