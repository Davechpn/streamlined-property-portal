import {
  Shield,
  Building,
  Users,
  Brain,
  ArrowRight
} from 'lucide-react';
import AnimatedContent from '@/components/AnimatedContent';
import { Button } from '@/components/ui/button';

export function CoreModules() {
  const categories = [
    {
      icon: Shield,
      title: 'Foundation & Security',
      description: 'Enterprise-grade platform infrastructure with advanced security and flexible billing',
      modules: ['Core Platform & Identity', 'Billing & Subscriptions'],
      features: ['Multi-tenant architecture', 'SSO integration', 'Advanced permissions', 'Flexible pricing plans', 'Automated invoicing', 'Payment processing'],
      color: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      icon: Building,
      title: 'Property Operations',
      description: 'Complete property and tenant lifecycle management with financial operations',
      modules: ['Portfolio Management', 'Tenancy & Financial Operations'],
      features: ['Property tracking', 'Unit management', 'Maintenance scheduling', 'Lease generation', 'Payment processing', 'Tenant communication'],
      color: 'from-emerald-500/10 to-green-500/10'
    },
    {
      icon: Users,
      title: 'Team & Workflow',
      description: 'Collaboration tools and workflow automation for efficient team coordination',
      modules: ['Operations & Workflows', 'Collaboration & AI'],
      features: ['Task management', 'Work order tracking', 'Vendor coordination', 'Real-time chat', 'Team notes', 'Smart notifications'],
      color: 'from-purple-500/10 to-pink-500/10'
    },
    {
      icon: Brain,
      title: 'Intelligence & Storage',
      description: 'Smart document management with AI-powered insights and secure cloud storage',
      modules: ['Documents & Media', 'AI Assistant'],
      features: ['Secure cloud storage', 'Version control', 'Advanced search', 'AI suggestions', 'Automated workflows', 'Smart analytics'],
      color: 'from-orange-500/10 to-red-500/10'
    }
  ];

  return (
    <section className="px-4 py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto space-y-12">
        <AnimatedContent
          className="text-center space-y-4"
          direction="vertical"
          distance={30}
          threshold={0.15}
          container={null}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Platform Capabilities
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            Four integrated categories designed to handle every aspect of modern property management
          </p>
        </AnimatedContent>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <AnimatedContent
              key={index}
              className="h-full"
              direction="vertical"
              distance={30}
              threshold={0.15}
              delay={index * 0.1}
              container={null}
            >
              <div className={`group relative h-full rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/20 hover:scale-[1.02]`}>
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${category.color} opacity-0 transition-opacity group-hover:opacity-100`}></div>
                
                <div className="relative space-y-4">
                  <div className="rounded-lg bg-primary/10 p-3 transition-all group-hover:bg-primary/20 w-fit">
                    <category.icon className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold">{category.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{category.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-primary">Includes:</p>
                    {category.modules.map((module, moduleIndex) => (
                      <div key={moduleIndex} className="flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-primary"></div>
                        <span className="text-sm">{module}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-2 border-t border-border/50">
                    <div className="flex flex-wrap gap-1">
                      {category.features.slice(0, 3).map((feature, featureIndex) => (
                        <span key={featureIndex} className="text-xs bg-muted px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                      {category.features.length > 3 && (
                        <span className="text-xs bg-muted px-2 py-1 rounded-full">
                          +{category.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedContent>
          ))}
        </div>

        <AnimatedContent
          className="text-center"
          direction="vertical"
          distance={30}
          threshold={0.15}
          container={null}
        >
          <div className="rounded-xl border bg-card p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Property Management?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join hundreds of property managers who have streamlined their operations with our comprehensive platform
            </p>
            <Button size="lg" className="text-base">
              Get Started Today <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}

export default CoreModules;