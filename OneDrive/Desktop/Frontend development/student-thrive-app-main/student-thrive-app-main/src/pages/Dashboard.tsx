import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import ProgramCard from '@/components/ProgramCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Heart, Award } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrolledPrograms, setEnrolledPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchEnrolledPrograms();
  }, [user, navigate]);

  const fetchEnrolledPrograms = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        programs (*)
      `)
      .eq('user_id', user.id)
      .order('enrolled_at', { ascending: false });

    if (!error && data) {
      setEnrolledPrograms(data.map(e => e.programs));
    }
    setLoading(false);
  };

  const handleUnenroll = async (programId: string) => {
    if (!user) return;

    await supabase
      .from('enrollments')
      .delete()
      .eq('user_id', user.id)
      .eq('program_id', programId);

    fetchEnrolledPrograms();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">My Dashboard</h1>
          <p className="text-muted-foreground">Track your wellness journey and manage your enrolled programs</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Programs</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledPrograms.length}</div>
              <p className="text-xs text-muted-foreground">Active wellness programs</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wellness Score</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">Keep up the great work!</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Milestones reached</p>
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Programs */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-foreground">My Programs</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading your programs...</p>
            </div>
          ) : enrolledPrograms.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledPrograms.map((program) => (
                <ProgramCard
                  key={program.id}
                  title={program.title}
                  description={program.description}
                  category={program.category}
                  imageUrl={program.image_url}
                  duration={program.duration}
                  level={program.level}
                  enrolled={true}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Programs Yet</CardTitle>
                <CardDescription>
                  You haven't enrolled in any programs yet. Explore our wellness programs and start your journey!
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
