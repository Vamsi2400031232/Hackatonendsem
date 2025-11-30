import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import ProgramCard from '@/components/ProgramCard';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Brain, Dumbbell, Apple } from 'lucide-react';
import heroImage from '@/assets/hero-wellness.jpg';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [programs, setPrograms] = useState<any[]>([]);
  const [enrolledPrograms, setEnrolledPrograms] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchPrograms();
    fetchEnrollments();
  }, [user, navigate]);

  const fetchPrograms = async () => {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .limit(6)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPrograms(data);
    }
    setLoading(false);
  };

  const fetchEnrollments = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('enrollments')
      .select('program_id')
      .eq('user_id', user.id);

    if (data) {
      setEnrolledPrograms(new Set(data.map(e => e.program_id)));
    }
  };

  const handleEnroll = async (programId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('enrollments')
      .insert({ user_id: user.id, program_id: programId });

    if (error) {
      toast({
        variant: "destructive",
        title: "Enrollment failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Successfully enrolled!",
        description: "Program added to your dashboard.",
      });
      fetchEnrollments();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60" />
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-primary-foreground">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Your Wellness Journey Starts Here
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-95">
              Discover comprehensive health and wellness resources designed specifically for students. 
              Achieve balance in mind, body, and nutrition.
            </p>
            <div className="flex gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/dashboard')}
                className="text-lg"
              >
                View My Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            Explore Our Wellness Programs
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Choose from our comprehensive range of programs designed to support your holistic well-being
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div 
              onClick={() => navigate('/mental-health')}
              className="bg-card rounded-xl p-8 text-center hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Brain className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Mental Health</h3>
              <p className="text-muted-foreground">
                Mindfulness, stress management, and emotional well-being resources
              </p>
            </div>
            
            <div 
              onClick={() => navigate('/fitness')}
              className="bg-card rounded-xl p-8 text-center hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="bg-secondary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Dumbbell className="h-10 w-10 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Fitness</h3>
              <p className="text-muted-foreground">
                Exercise programs, workout routines, and physical wellness guidance
              </p>
            </div>
            
            <div 
              onClick={() => navigate('/nutrition')}
              className="bg-card rounded-xl p-8 text-center hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="bg-accent/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Apple className="h-10 w-10 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">Nutrition</h3>
              <p className="text-muted-foreground">
                Healthy eating tips, meal planning, and nutritional education
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            Featured Programs
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Start your wellness journey with our most popular programs
          </p>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading programs...</p>
            </div>
          ) : programs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program) => (
                <ProgramCard
                  key={program.id}
                  title={program.title}
                  description={program.description}
                  category={program.category}
                  imageUrl={program.image_url}
                  duration={program.duration}
                  level={program.level}
                  onEnroll={() => handleEnroll(program.id)}
                  enrolled={enrolledPrograms.has(program.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No programs available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
