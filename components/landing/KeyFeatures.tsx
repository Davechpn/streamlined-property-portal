import { 
  Building2, 
  Users, 
  FileText, 
  CreditCard, 
  MessageSquare, 
  BarChart3,
  CheckCircle
} from 'lucide-react';
import AnimatedContent from '@/components/AnimatedContent';
import { ShineBorder } from '@/components/ui/shine-border';

export function KeyFeatures() {
  const features = [
    {
      icon: Building2,
      title: 'Portfolio Management',
      description: 'Track properties, units, and maintenance schedules in one centralized platform.',
      highlight: 'Manage unlimited properties'
    },
    {
      icon: Users,
      title: 'Tenant Evaluation',
      description: 'Screen tenants, collect documents, and rate applicants with comprehensive tools.',
      highlight: 'Streamlined tenant screening'
    },
    {
      icon: FileText,
      title: 'Documents & Media',
      description: 'Secure cloud storage for leases, certificates, photos, and important documents.',
      highlight: 'Unlimited secure storage'
    },
    {
      icon: CreditCard,
      title: 'Automated Billing',
      description: 'Generate invoices, process payments, and send reminders automatically.',
      highlight: 'Reduce payment delays by 80%'
    },
    {
      icon: MessageSquare,
      title: 'Team Collaboration',
      description: 'Notes, chat, and task assignment for seamless team coordination.',
      highlight: 'Real-time communication'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive reports on occupancy, income, expenses, and performance metrics.',
      highlight: 'Data-driven decisions'
    }
  ];

  return (
    <section className="px-4 py-16">
      <div className="container mx-auto space-y-12">
        <AnimatedContent
          className="text-center space-y-4"
          direction="vertical"
          distance={30}
          threshold={0.15}
          container={null}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Powerful Features for Modern Property Management
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            Everything you need to streamline operations, enhance tenant experiences, and grow your property business
          </p>
        </AnimatedContent>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <AnimatedContent
              key={index}
              className="relative h-full"
              direction="vertical"
              distance={20}
              threshold={0.15}
              delay={index * 0.1}
              container={null}
            >
              <div className="relative h-full rounded-lg border bg-card p-6 transition-all hover:shadow-lg hover:scale-[1.02]">
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-primary font-medium">
                    <CheckCircle className="h-3 w-3" />
                    <span>{feature.highlight}</span>
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
                
                <ShineBorder
                  borderWidth={1}
                  duration={12}
                  shineColor={["#7C3AED", "#06B6D4"]}
                  className="absolute inset-0 rounded-lg"
                  aria-hidden
                />
              </div>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}

export default KeyFeatures;