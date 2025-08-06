import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SafeAreaView } from "@/components/ios/SafeAreaView";
import { IOSCard } from "@/components/ios/IOSCard";
import { IOSButton } from "@/components/ios/IOSButton";
import { Heart, Target, Users, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ONBOARDING_STEPS = [
  "welcome",
  "profile",
  "goals", 
  "complete"
] as const;

type OnboardingStep = typeof ONBOARDING_STEPS[number];

interface ProfileData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

const GOAL_OPTIONS = [
  {
    type: "mental_wellness",
    title: "Mental Wellness",
    description: "Track mood, stress, and emotional well-being",
    icon: Heart,
    color: "bg-pink-500/10 text-pink-600"
  },
  {
    type: "physical_fitness", 
    title: "Physical Fitness",
    description: "Monitor exercise, movement, and physical health",
    icon: Target,
    color: "bg-blue-500/10 text-blue-600"
  },
  {
    type: "nutrition",
    title: "Nutrition",
    description: "Track eating habits and nutritional goals",
    icon: Sparkles,
    color: "bg-green-500/10 text-green-600"
  },
  {
    type: "sleep",
    title: "Sleep Quality",
    description: "Monitor sleep patterns and recovery",
    icon: Users,
    color: "bg-purple-500/10 text-purple-600"
  }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    dateOfBirth: ""
  });
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const stepIndex = ONBOARDING_STEPS.indexOf(currentStep);
  const progress = ((stepIndex + 1) / ONBOARDING_STEPS.length) * 100;

  const handleNext = () => {
    const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
    if (currentIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(ONBOARDING_STEPS[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(ONBOARDING_STEPS[currentIndex - 1]);
    }
  };

  const toggleGoal = (goalType: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalType) 
        ? prev.filter(g => g !== goalType)
        : [...prev, goalType]
    );
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          date_of_birth: profileData.dateOfBirth,
          onboarding_completed: true
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Create health goals
      const goalsToCreate = selectedGoals.map(goalType => {
        const goalOption = GOAL_OPTIONS.find(g => g.type === goalType);
        return {
          user_id: user.id,
          goal_type: goalType,
          title: goalOption?.title || goalType,
          description: goalOption?.description || ""
        };
      });

      if (goalsToCreate.length > 0) {
        const { error: goalsError } = await supabase
          .from("health_goals")
          .insert(goalsToCreate);
        
        if (goalsError) throw goalsError;
      }

      toast({
        title: "Welcome to KnoMe!",
        description: "Your profile has been set up successfully."
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Setup Failed",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderWelcomeStep = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-primary">Welcome to KnoMe</h1>
        <p className="text-lg text-muted-foreground">
          Your personal whole-person wellness companion
        </p>
      </div>
      
      <div className="space-y-6">
        <IOSCard className="p-6">
          <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Holistic Wellness</h3>
          <p className="text-muted-foreground">
            Track your mental, physical, and emotional well-being in one place
          </p>
        </IOSCard>
        
        <IOSCard className="p-6">
          <Target className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Personal Goals</h3>
          <p className="text-muted-foreground">
            Set and achieve meaningful health and wellness goals
          </p>
        </IOSCard>
        
        <IOSCard className="p-6">
          <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">AI Insights</h3>
          <p className="text-muted-foreground">
            Get personalized recommendations and insights about your health
          </p>
        </IOSCard>
      </div>
      
      <IOSButton onClick={handleNext} className="w-full">
        Get Started
        <ArrowRight className="w-5 h-5 ml-2" />
      </IOSButton>
    </div>
  );

  const renderProfileStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Tell us about yourself</h2>
        <p className="text-muted-foreground">
          Help us personalize your KnoMe experience
        </p>
      </div>
      
      <IOSCard className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={profileData.firstName}
            onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
            placeholder="Enter your first name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={profileData.lastName}
            onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
            placeholder="Enter your last name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={profileData.dateOfBirth}
            onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
          />
        </div>
      </IOSCard>
      
      <div className="flex gap-3">
        <IOSButton variant="outline" onClick={handleBack} className="flex-1">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </IOSButton>
        <IOSButton 
          onClick={handleNext} 
          className="flex-1"
          disabled={!profileData.firstName || !profileData.lastName}
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </IOSButton>
      </div>
    </div>
  );

  const renderGoalsStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose your wellness goals</h2>
        <p className="text-muted-foreground">
          Select the areas you'd like to focus on (you can change these later)
        </p>
      </div>
      
      <div className="grid gap-4">
        {GOAL_OPTIONS.map((goal) => {
          const Icon = goal.icon;
          const isSelected = selectedGoals.includes(goal.type);
          
          return (
            <IOSCard
              key={goal.type}
              className={`p-4 cursor-pointer transition-all ${
                isSelected 
                  ? "ring-2 ring-primary bg-primary/5" 
                  : "hover:bg-muted/50"
              }`}
              onClick={() => toggleGoal(goal.type)}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full ${goal.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{goal.title}</h3>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
            </IOSCard>
          );
        })}
      </div>
      
      <div className="flex gap-3">
        <IOSButton variant="outline" onClick={handleBack} className="flex-1">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </IOSButton>
        <IOSButton 
          onClick={handleNext}
          className="flex-1"
          disabled={selectedGoals.length === 0}
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </IOSButton>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Sparkles className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">You're all set!</h2>
        <p className="text-muted-foreground">
          Welcome to your personalized wellness journey, {profileData.firstName}
        </p>
      </div>
      
      <IOSCard className="p-6 text-left">
        <h3 className="font-semibold mb-4">Your Setup Summary:</h3>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Name:</span> {profileData.firstName} {profileData.lastName}</p>
          <p><span className="font-medium">Goals:</span> {selectedGoals.length} selected</p>
          {selectedGoals.length > 0 && (
            <div className="mt-2">
              <p className="font-medium mb-1">Selected goals:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                {selectedGoals.map(goalType => {
                  const goal = GOAL_OPTIONS.find(g => g.type === goalType);
                  return <li key={goalType}>{goal?.title}</li>;
                })}
              </ul>
            </div>
          )}
        </div>
      </IOSCard>
      
      <IOSButton 
        onClick={handleComplete} 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Setting up..." : "Start Your Journey"}
      </IOSButton>
    </div>
  );

  return (
    <SafeAreaView className="min-h-screen bg-background">
      <div className="p-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-muted rounded-full h-2 mb-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Step {stepIndex + 1} of {ONBOARDING_STEPS.length}
          </p>
        </div>

        {/* Step Content */}
        <div className="max-w-md mx-auto">
          {currentStep === "welcome" && renderWelcomeStep()}
          {currentStep === "profile" && renderProfileStep()}
          {currentStep === "goals" && renderGoalsStep()}
          {currentStep === "complete" && renderCompleteStep()}
        </div>
      </div>
    </SafeAreaView>
  );
}