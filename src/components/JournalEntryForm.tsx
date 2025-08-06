import { useState } from 'react';
import { useJournal } from '@/hooks/useJournal';
import { IOSCard } from '@/components/ios/IOSCard';
import { IOSButton } from '@/components/ios/IOSButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  X, 
  Heart, 
  Smile, 
  Meh, 
  Frown, 
  Plus,
  Hash
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface JournalEntryFormProps {
  onClose: () => void;
}

const MOOD_OPTIONS = [
  { value: 5, label: 'Amazing', icon: Heart, color: 'text-green-600 bg-green-100' },
  { value: 4, label: 'Good', icon: Smile, color: 'text-blue-600 bg-blue-100' },
  { value: 3, label: 'Okay', icon: Meh, color: 'text-yellow-600 bg-yellow-100' },
  { value: 2, label: 'Rough', icon: Frown, color: 'text-orange-600 bg-orange-100' },
  { value: 1, label: 'Difficult', icon: Frown, color: 'text-red-600 bg-red-100' }
];

const SUGGESTED_TAGS = [
  'gratitude', 'reflection', 'goals', 'anxiety', 'mindfulness', 
  'exercise', 'sleep', 'work', 'relationships', 'self-care'
];

export const JournalEntryForm: React.FC<JournalEntryFormProps> = ({ onClose }) => {
  const { createEntry } = useJournal();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood_rating: null as number | null,
    tags: [] as string[]
  });
  const [customTag, setCustomTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    setIsSubmitting(true);
    try {
      await createEntry({
        title: formData.title.trim(),
        content: formData.content.trim(),
        mood_rating: formData.mood_rating || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined
      });
      onClose();
    } catch (error) {
      console.error('Error creating journal entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const addCustomTag = () => {
    const tag = customTag.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setCustomTag('');
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <IOSCard className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">New Journal Entry</h2>
                <p className="text-sm text-muted-foreground">Capture your thoughts and reflections</p>
              </div>
            </div>
            <IOSButton variant="outline" size="sm" onClick={onClose} type="button">
              <X className="h-4 w-4" />
            </IOSButton>
          </div>

          {/* Title */}
          <div className="space-y-2 mb-4">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="What's on your mind today?"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2 mb-4">
            <Label htmlFor="content">Your Reflection</Label>
            <Textarea
              id="content"
              placeholder="Express your thoughts, feelings, or experiences..."
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={6}
              required
            />
          </div>

          {/* Mood Rating */}
          <div className="space-y-3 mb-4">
            <Label>How are you feeling? (optional)</Label>
            <div className="grid grid-cols-5 gap-2">
              {MOOD_OPTIONS.map((mood) => {
                const MoodIcon = mood.icon;
                const isSelected = formData.mood_rating === mood.value;
                
                return (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      mood_rating: prev.mood_rating === mood.value ? null : mood.value 
                    }))}
                    className={cn(
                      'p-3 rounded-lg border text-center transition-all hover:scale-105',
                      isSelected 
                        ? `${mood.color} border-current` 
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <MoodIcon className={cn(
                      'h-5 w-5 mx-auto mb-1',
                      isSelected ? 'text-current' : 'text-muted-foreground'
                    )} />
                    <span className={cn(
                      'text-xs',
                      isSelected ? 'text-current font-medium' : 'text-muted-foreground'
                    )}>
                      {mood.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3 mb-6">
            <Label>Tags (optional)</Label>
            
            {/* Suggested Tags */}
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    'text-xs px-2 py-1 rounded-full border transition-colors',
                    formData.tags.includes(tag)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:border-primary/50'
                  )}
                >
                  #{tag}
                </button>
              ))}
            </div>

            {/* Custom Tag Input */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Add custom tag"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                  className="pl-10"
                />
              </div>
              <IOSButton 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addCustomTag}
                disabled={!customTag.trim()}
              >
                <Plus className="h-4 w-4" />
              </IOSButton>
            </div>

            {/* Selected Tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {formData.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => toggleTag(tag)}
                  >
                    #{tag} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <IOSButton 
              type="button"
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </IOSButton>
            <IOSButton 
              type="submit"
              disabled={!formData.title.trim() || !formData.content.trim() || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Saving...' : 'Save Entry'}
            </IOSButton>
          </div>
        </form>
      </IOSCard>
    </div>
  );
};

export default JournalEntryForm;