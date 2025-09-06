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
    <SafeAreaView className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-wellness-teal/5 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 relative">
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
                className="glass-effect"
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
              className="glass-effect"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </IOSButton>
          )}
        </div>

        <div className="text-center max-w-5xl mx-auto">
          <div className="flex items-center justify-center mb-8 animate-scale-in">
            <div className="bg-gradient-wellness rounded-full p-4 mr-6 animate-glow" aria-hidden="true">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-wellness bg-clip-text text-transparent">
              KnoMe
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed animate-fade-in max-w-4xl mx-auto">
            Your personal data, your control, your future. A trauma-informed platform designed 
            specifically for foster youth to consolidate education, health, and behavioral data 
            with AI-powered insights.
          </p>

          <div className="flex items-center justify-center gap-3 mb-12 animate-slide-up flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Privacy-First</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-wellness-coral/10 backdrop-blur-sm">
              <Heart className="h-5 w-5 text-wellness-coral" />
              <span className="text-sm font-semibold text-wellness-coral">Trauma-Informed</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-wellness-teal/10 backdrop-blur-sm">
              <Sparkles className="h-5 w-5 text-wellness-teal" />
              <span className="text-sm font-semibold text-wellness-teal">AI-Powered</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-16 flex-wrap animate-slide-up" style={{animationDelay: '0.2s'}}>
            <IOSButton 
              onClick={handleGetStarted}
              className={`wellness-button px-8 py-4 text-lg font-bold transition-all duration-500 transform ${isAnimated ? 'scale-95' : 'hover:scale-105'} bg-gradient-wellness text-white border-0`}
            >
              {user ? 'Go to Dashboard' : 'Get Started with KnoMe'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </IOSButton>
            <IOSButton
              variant="outline"
              onClick={() => setAssistantOpen(true)}
              className="wellness-button px-6 py-4 text-lg font-semibold glass-effect"
            >
              <Bot className="mr-2 h-5 w-5" />
              Ask Stanley
            </IOSButton>
            <IOSButton
              variant="ghost"
              onClick={() => navigate('/partners/turnaround')}
              className="wellness-button px-6 py-4 text-lg font-semibold hover:bg-primary/10"
            >
              Partner Preview
            </IOSButton>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          {[
            {
              icon: Shield,
              title: "Data Wallet",
              description: "Secure, encrypted storage for all your important documents and records",
              gradient: "from-blue-500/20 to-blue-600/20",
              iconColor: "text-blue-600"
            },
            {
              icon: Brain,
              title: "AI Assistant Stanley",
              description: "Personalized insights and recommendations tailored to your journey",
              gradient: "from-purple-500/20 to-purple-600/20",
              iconColor: "text-purple-600"
            },
            {
              icon: Heart,
              title: "Whole-Person Profile",
              description: "Visual representation of your cognitive, social, emotional, and physical growth",
              gradient: "from-pink-500/20 to-pink-600/20",
              iconColor: "text-pink-600"
            },
            {
              icon: Users,
              title: "Personalized Roadmap",
              description: "Dynamic milestones and goals that adapt as you progress",
              gradient: "from-teal-500/20 to-teal-600/20",
              iconColor: "text-teal-600"
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="wellness-card group p-6 animate-fade-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-all duration-500 backdrop-blur-sm`}>
                  <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="wellness-card mt-24 p-12 glass-effect animate-fade-in" style={{animationDelay: '0.6s'}}>
          <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-wellness bg-clip-text text-transparent">
            Built with Your Privacy in Mind
          </h3>
          <div className="grid md:grid-cols-3 gap-12">
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
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-wellness rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-all duration-500" aria-hidden="true">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-4 text-foreground">{item.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <AIAssistant open={assistantOpen} onOpenChange={setAssistantOpen} />
      </div>
    </SafeAreaView>
  );
};

export default Index;