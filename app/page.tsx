import { Navigation } from '@/components/landing/Navigation';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { KeyFeatures } from '@/components/landing/KeyFeatures';
import { CoreModules } from '@/components/landing/CoreModules';
import { Footer } from '@/components/landing/Footer';
import Image from 'next/image';
import DotGrid from '@/components/DotGrid';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col relative">
      <Navigation />
      <main className="flex-1">
              {/* subtle dot grid background */}
      <div className="fixed inset-0 -z-10 opacity-20 pointer-events-none">
        <DotGrid
          dotSize={2}
          gap={30}
          baseColor="#555555"
          activeColor="#7C3AED"
          style={{}}
        />
      </div>
        <Hero />
        <Features />
        {/* <KeyFeatures /> */}
        <CoreModules />
      </main>
      <Footer />
    </div>
  );
}
