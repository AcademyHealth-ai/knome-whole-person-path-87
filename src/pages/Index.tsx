
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Heart, Brain, Users, ArrowRight, Sparkles } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [isAnimated, setIsAnimated] = useState(false);

  const handleGetStarted = () => {
    setIsAnimated(true);
    setTimeout(() => navigate('/onboarding'), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-full p-3 mr-4">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              KnoMe.app
            </h1>
          </div>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Your personal data, your control, your future. A trauma-informed platform designed 
            specifically for foster youth to consolidate education, health, and behavioral data 
            with AI-powered insights.
          </p>

          <div className="flex items-center justify-center gap-2 mb-8">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-600 font-medium">Privacy-First</span>
            <span className="text-gray-400">•</span>
            <Heart className="h-5 w-5 text-green-600" />
            <span className="text-sm text-gray-600 font-medium">Trauma-Informed</span>
            <span className="text-gray-400">•</span>
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span className="text-sm text-gray-600 font-medium">AI-Powered</span>
          </div>

          <Button 
            onClick={handleGetStarted}
            size="lg"
            className={`bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform ${isAnimated ? 'scale-95' : 'hover:scale-105'} shadow-lg hover:shadow-xl`}
          >
            Get Started with KnoMe
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {[
            {
              icon: Shield,
              title: "Data Wallet",
              description: "Secure, encrypted storage for all your important documents and records",
              color: "from-blue-500 to-blue-600"
            },
            {
              icon: Brain,
              title: "AI Assistant Charlie",
              description: "Personalized insights and recommendations tailored to your journey",
              color: "from-purple-500 to-purple-600"
            },
            {
              icon: Heart,
              title: "Whole-Person Profile",
              description: "Visual representation of your cognitive, social, emotional, and physical growth",
              color: "from-green-500 to-green-600"
            },
            {
              icon: Users,
              title: "Personalized Roadmap",
              description: "Dynamic milestones and goals that adapt as you progress",
              color: "from-orange-500 to-orange-600"
            }
          ].map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-105">
              <CardHeader className="text-center pb-2">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${feature.color} mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-800">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Built with Your Privacy in Mind</h3>
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
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
