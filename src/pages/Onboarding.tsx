
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Hammer, Search, Shield, Users, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({
    groupType: '',
    stressLevel: '',
    goals: '',
    mindset: '',
    journalPreference: ''
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const groupTypes = [
    {
      value: 'builders',
      title: 'Builders',
      description: 'I like creating, making things, and solving problems with my hands',
      icon: Hammer,
      color: 'from-orange-500 to-red-500'
    },
    {
      value: 'seekers',
      title: 'Seekers',
      description: 'I love learning new things and exploring ideas',
      icon: Search,
      color: 'from-blue-500 to-purple-500'
    },
    {
      value: 'survivors',
      title: 'Survivors',
      description: 'I focus on staying strong and helping myself and others get through challenges',
      icon: Shield,
      color: 'from-green-500 to-teal-500'
    },
    {
      value: 'connectors',
      title: 'Connectors',
      description: 'I enjoy bringing people together and building relationships',
      icon: Users,
      color: 'from-pink-500 to-purple-500'
    }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateAnswer = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Which group feels most like you?</h2>
              <p className="text-gray-600">This helps us personalize your experience from the start.</p>
            </div>
            
            <div className="grid gap-4">
              {groupTypes.map((group) => (
                <Card 
                  key={group.value}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                    answers.groupType === group.value 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => updateAnswer('groupType', group.value)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${group.color} flex items-center justify-center`}>
                        <group.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800">{group.title}</h3>
                        <p className="text-gray-600 text-sm">{group.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">How has stress been for you lately?</h2>
              <p className="text-gray-600">Be honest - this helps Charlie understand how to support you.</p>
            </div>
            
            <RadioGroup value={answers.stressLevel} onValueChange={(value) => updateAnswer('stressLevel', value)}>
              {[
                { value: 'low', label: 'Pretty manageable - I feel in control' },
                { value: 'medium', label: 'Some ups and downs, but okay overall' },
                { value: 'high', label: 'Pretty overwhelming - hard to keep up' },
                { value: 'very-high', label: 'Really struggling - need more support' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2 p-4 rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="text-gray-700 cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">What are you hoping to achieve?</h2>
              <p className="text-gray-600">Share your goals - big or small, short-term or long-term.</p>
            </div>
            
            <Textarea
              value={answers.goals}
              onChange={(e) => updateAnswer('goals', e.target.value)}
              placeholder="I want to..."
              className="min-h-32 text-base resize-none"
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">How do you like to think about things?</h2>
              <p className="text-gray-600">This helps us understand your natural approach to planning and reflection.</p>
            </div>
            
            <RadioGroup value={answers.mindset} onValueChange={(value) => updateAnswer('mindset', value)}>
              {[
                { value: 'forward', label: 'I prefer focusing on future plans and possibilities' },
                { value: 'present', label: 'I like to focus on what\'s happening right now' },
                { value: 'reflective', label: 'I learn best by thinking about past experiences' },
                { value: 'balanced', label: 'I like to balance all three - past, present, and future' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2 p-4 rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="text-gray-700 cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">How would you like to journal?</h2>
              <p className="text-gray-600">Journaling helps Charlie learn your patterns and provide better insights.</p>
            </div>
            
            <RadioGroup value={answers.journalPreference} onValueChange={(value) => updateAnswer('journalPreference', value)}>
              {[
                { value: 'daily-prompts', label: 'Daily prompts - give me specific questions to answer' },
                { value: 'weekly-checkin', label: 'Weekly check-ins - less frequent but more detailed' },
                { value: 'freeform', label: 'Free writing - I prefer to write about whatever I want' },
                { value: 'voice', label: 'Voice journaling - I\'d rather talk than type' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2 p-4 rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="text-gray-700 cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 1: return answers.groupType !== '';
      case 2: return answers.stressLevel !== '';
      case 3: return answers.goals.trim() !== '';
      case 4: return answers.mindset !== '';
      case 5: return answers.journalPreference !== '';
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">Let's get to know you</h1>
          </div>
          <Progress value={progress} className="w-full max-w-md mx-auto" />
          <p className="text-sm text-gray-600 mt-2">Step {currentStep} of {totalSteps}</p>
        </div>

        {/* Content */}
        <Card className="max-w-2xl mx-auto border-0 shadow-lg">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between max-w-2xl mx-auto mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!isStepComplete()}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white flex items-center gap-2"
          >
            {currentStep === totalSteps ? 'Complete Setup' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
