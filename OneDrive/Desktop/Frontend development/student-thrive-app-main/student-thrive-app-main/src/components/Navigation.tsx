import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, LogOut, User, Home, Brain, Dumbbell, Apple } from 'lucide-react';

export default function Navigation() {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <Heart className="h-6 w-6" />
            Student Wellness
          </Link>
          
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link to="/" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                  <Home className="h-4 w-4" />
                  Home
                </Link>
                <Link to="/mental-health" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                  <Brain className="h-4 w-4" />
                  Mental Health
                </Link>
                <Link to="/fitness" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                  <Dumbbell className="h-4 w-4" />
                  Fitness
                </Link>
                <Link to="/nutrition" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                  <Apple className="h-4 w-4" />
                  Nutrition
                </Link>
                
                <div className="h-6 w-px bg-border" />
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')}
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Dashboard
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate('/auth')}>Sign In</Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
