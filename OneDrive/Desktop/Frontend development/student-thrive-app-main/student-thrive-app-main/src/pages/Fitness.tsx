import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import ProgramCard from '@/components/ProgramCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import fitnessImage from '@/assets/fitness.jpg';

export default function Fitness() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [programs, setPrograms] = useState<any[]>([]);
  const [enrolledPrograms, setEnrolledPrograms] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchPrograms();
    fetchEnrollments();
  }, [user, navigate]);

  const fetchPrograms = async () => {
    const { data } = await supabase
      .from('programs')
      .select('*')
      .eq('category', 'fitness')
      .order('created_at', { ascending: false });

    if (data) {
      setPrograms(data);
    }
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
      .insert([{ user_id: user.id, program_id: programId }]);

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
      
      <div className="relative h-80 overflow-hidden bg-gradient-to-r from-secondary to-accent">
        <img 
          src={fitnessImage}
          alt="Fitness"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
        />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-primary-foreground">
            <h1 className="text-5xl font-bold mb-4">Fitness & Exercise</h1>
            <p className="text-xl opacity-95">
              Explore workout routines, exercise programs, and physical wellness guidance
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {programs.length > 0 ? (
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
            <p className="text-muted-foreground">No fitness programs available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
