import { useState } from 'react';
import { useHealthGoals } from '@/hooks/useHealthGoals';
import { IOSCard } from '@/components/ios/IOSCard';
import { IOSButton } from '@/components/ios/IOSButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Target, TrendingUp, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WellnessCheckInProps {
  onClose: () => void;
}

export const WellnessCheckIn: React.FC<WellnessCheckInProps> = ({ onClose }) => {
  const { goals, updateGoalProgress } = useHealthGoals();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [progressValue, setProgressValue] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const activeGoals = goals.filter(goal => goal.is_active);

  const handleUpdateProgress = async () => {
    if (!selectedGoal || !progressValue) return;

    setIsUpdating(true);
    try {
      await updateGoalProgress(selectedGoal, parseInt(progressValue));
      setSelectedGoal(null);
      setProgressValue('');
      onClose();
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getGoalIcon = (goalType: string) => {
    switch (goalType) {
      case 'mental_wellness':
        return Heart;
      case 'physical_fitness':
        return TrendingUp;
      case 'nutrition':
        return Target;
      case 'sleep':
        return Heart;
      default:
        return Target;
    }
  };

  const getGoalColor = (goalType: string) => {
    switch (goalType) {
      case 'mental_wellness':
        return 'bg-pink-500/10 text-pink-600 border-pink-200';
      case 'physical_fitness':
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'nutrition':
        return 'bg-green-500/10 text-green-600 border-green-200';
      case 'sleep':
        return 'bg-purple-500/10 text-purple-600 border-purple-200';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <IOSCard className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Wellness Check-In</h2>
              <p className="text-sm text-muted-foreground">Update your goal progress</p>
            </div>
          </div>
          <IOSButton variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </IOSButton>
        </div>

        {activeGoals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No active goals to update</p>
            <IOSButton variant="outline" onClick={onClose}>
              Close
            </IOSButton>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Goal Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select a goal to update:</Label>
              <div className="space-y-2">
                {activeGoals.map((goal) => {
                  const Icon = getGoalIcon(goal.goal_type);
                  const isSelected = selectedGoal === goal.id;
                  const currentProgress = goal.target_value 
                    ? Math.min(Math.round(((goal.current_value || 0) / goal.target_value) * 100), 100)
                    : 0;

                  return (
                    <div
                      key={goal.id}
                      className={cn(
                        'p-4 border rounded-lg cursor-pointer transition-all',
                        getGoalColor(goal.goal_type),
                        isSelected && 'ring-2 ring-primary bg-primary/5'
                      )}
                      onClick={() => setSelectedGoal(goal.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm">{goal.title}</h3>
                          {goal.description && (
                            <p className="text-xs text-muted-foreground mt-1">{goal.description}</p>
                          )}
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>{currentProgress}%</span>
                            </div>
                            <Progress value={currentProgress} className="h-1.5" />
                            {goal.unit && goal.current_value !== null && goal.target_value && (
                              <p className="text-xs text-muted-foreground">
                                Current: {goal.current_value} / {goal.target_value} {goal.unit}
                              </p>
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Progress Input */}
            {selectedGoal && (
              <div className="space-y-3">
                <Label htmlFor="progress" className="text-sm font-medium">
                  Update Progress Value:
                </Label>
                <div className="space-y-2">
                  <Input
                    id="progress"
                    type="number"
                    placeholder="Enter new value"
                    value={progressValue}
                    onChange={(e) => setProgressValue(e.target.value)}
                    min="0"
                  />
                  {(() => {
                    const goal = goals.find(g => g.id === selectedGoal);
                    if (goal?.unit) {
                      return (
                        <p className="text-xs text-muted-foreground">
                          Enter value in {goal.unit}
                          {goal.target_value && ` (target: ${goal.target_value})`}
                        </p>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <IOSButton 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </IOSButton>
              <IOSButton 
                onClick={handleUpdateProgress}
                disabled={!selectedGoal || !progressValue || isUpdating}
                className="flex-1"
              >
                {isUpdating ? 'Updating...' : 'Update Progress'}
              </IOSButton>
            </div>
          </div>
        )}
      </IOSCard>
    </div>
  );
};

export default WellnessCheckIn;