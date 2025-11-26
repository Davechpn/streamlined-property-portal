import { Building2, Users, Shield, BarChart3, Settings, Zap } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

export function Features() {
  const features = [
    {
      icon: Building2,
      title: 'Property Management',
      description: 'Organize and manage multiple properties with ease. Track details, documents, and operations in one place.',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Invite team members, assign roles, and collaborate seamlessly with built-in permission controls.',
    },
    {
      icon: Shield,
      title: 'Role-Based Access',
      description: 'Secure your data with granular permissions. Control who can view, edit, and manage different aspects.',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Track activities, generate reports, and gain insights into your property operations and team performance.',
    },
    {
      icon: Settings,
      title: 'Platform Administration',
      description: 'Comprehensive admin tools for managing organizations, tracking activities, and monitoring system health.',
    },
    {
      icon: Zap,
      title: 'Fast & Reliable',
      description: 'Built with modern technology for exceptional performance, reliability, and a smooth user experience.',
    },
  ];

  return (
    <section className="container px-4 py-16">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Everything You Need
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features to streamline your property management workflow
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
