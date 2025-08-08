import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SafeAreaView } from '@/components/ios/SafeAreaView';
import { IOSCard } from '@/components/ios/IOSCard';
import { IOSButton } from '@/components/ios/IOSButton';
import { useAuth } from '@/hooks/useAuth';
import { AIAssistant } from '@/components/AIAssistant';
import { Shield, Heart, Brain, Users, ArrowRight, Sparkles, LogIn, UserCircle, LogOut, Bot } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isAnimated, setIsAnimated] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);

  const handleGetStarted = () => {
    setIsAnimated(true);
    if (user) {
      setTimeout(() => navigate('/dashboard'), 500);
    } else {
      setTimeout(() => navigate('/auth'), 500);
    }
  };

  return (
    <SafeAreaView className="min-h-screen bg-gradient-ios">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        {/* Auth Status Bar */}
        <div className="flex justify-end mb-8">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserCircle className="h-4 w-4" />
                <span>Welcome back!</span>
              </div>
              <IOSButton
                variant="outline"
                size="sm"
                onClick={signOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </IOSButton>
            </div>
          ) : (
            <IOSButton
              variant="outline"
              size="sm"
              onClick={() => navigate('/auth')}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </IOSButton>
          )}
        </div>

        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-primary rounded-full p-3 mr-4" aria-hidden="true">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              KnoMe.app
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Your personal data, your control, your future. A trauma-informed platform designed 
            specifically for foster youth to consolidate education, health, and behavioral data 
            with AI-powered insights.
          </p>

          <div className="flex items-center justify-center gap-2 mb-8">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground font-medium">Privacy-First</span>
            <span className="text-muted-foreground/50">•</span>
            <Heart className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground font-medium">Trauma-Informed</span>
            <span className="text-muted-foreground/50">•</span>
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground font-medium">AI-Powered</span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-8">
            <IOSButton 
              onClick={handleGetStarted}
              className={`px-8 py-4 text-lg font-semibold transition-all duration-300 transform ${isAnimated ? 'scale-95' : 'hover:scale-105'} shadow-lg hover:shadow-xl`}
            >
              {user ? 'Go to Dashboard' : 'Get Started with KnoMe'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </IOSButton>
            <IOSButton
              variant="outline"
              onClick={() => setAssistantOpen(true)}
              className="px-6 py-4 text-lg font-semibold"
            >
              Ask Stanley
            </IOSButton>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {[
            {
              icon: Shield,
              title: "Data Wallet",
              description: "Secure, encrypted storage for all your important documents and records",
              color: "bg-blue-500/10 text-blue-600"
            },
            {
              icon: Brain,
              title: "AI Assistant Stanley",
              description: "Personalized insights and recommendations tailored to your journey",
              color: "bg-purple-500/10 text-purple-600"
            },
            {
              icon: Heart,
              title: "Whole-Person Profile",
              description: "Visual representation of your cognitive, social, emotional, and physical growth",
              color: "bg-green-500/10 text-green-600"
            },
            {
              icon: Users,
              title: "Personalized Roadmap",
              description: "Dynamic milestones and goals that adapt as you progress",
              color: "bg-orange-500/10 text-orange-600"
            }
          ].map((feature, index) => (
            <IOSCard key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-center pb-2">
                <div className={`w-12 h-12 rounded-full ${feature.color} mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              </div>
              <p className="text-center text-muted-foreground leading-relaxed text-sm">
                {feature.description}
              </p>
            </IOSCard>
          ))}
        </div>

        {/* Trust Indicators */}
        <IOSCard blur className="mt-16 p-8">
          <h3 className="text-2xl font-bold text-center mb-8">Built with Your Privacy in Mind</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "HIPAA Compliant",
                description: "Your health data is protected according to the highest medical privacy standards"
              },
              {
                title: "FERPA Compliant", 
                description: "Educational records are secured according to federal education privacy laws"
              },
              {
                title: "You Own Your Data",
                description: "Complete control over who sees what, when, and for how long"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center" aria-hidden="true">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </IOSCard>
        <AIAssistant open={assistantOpen} onOpenChange={setAssistantOpen} />
      </div>
    </SafeAreaView>
  );
};

export default Index;