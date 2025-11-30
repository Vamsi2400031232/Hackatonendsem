import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp } from 'lucide-react';

interface ProgramCardProps {
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  duration?: string;
  level?: string;
  onEnroll?: () => void;
  enrolled?: boolean;
}

export default function ProgramCard({
  title,
  description,
  category,
  imageUrl,
  duration,
  level,
  onEnroll,
  enrolled,
}: ProgramCardProps) {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'mental_health':
        return 'bg-primary/10 text-primary';
      case 'fitness':
        return 'bg-secondary/10 text-secondary';
      case 'nutrition':
        return 'bg-accent/10 text-accent';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'mental_health':
        return 'Mental Health';
      case 'fitness':
        return 'Fitness';
      case 'nutrition':
        return 'Nutrition';
      default:
        return cat;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge className={getCategoryColor(category)}>
              {getCategoryLabel(category)}
            </Badge>
          </div>
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-card-foreground">{title}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          {duration && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{duration}</span>
            </div>
          )}
          {level && (
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>{level}</span>
            </div>
          )}
        </div>
        
        {onEnroll && (
          <Button
            onClick={onEnroll}
            className="w-full"
            variant={enrolled ? "secondary" : "default"}
            disabled={enrolled}
          >
            {enrolled ? 'Enrolled' : 'Enroll Now'}
          </Button>
        )}
      </div>
    </Card>
  );
}
