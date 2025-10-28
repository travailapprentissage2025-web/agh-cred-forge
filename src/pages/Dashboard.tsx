import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, BookOpen, TrendingUp, PlayCircle, GraduationCap, Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfileEditor } from '@/components/ProfileEditor';
import { LevelProgress } from '@/components/gamification/LevelProgress';
import { StreakDisplay } from '@/components/gamification/StreakDisplay';
import { BadgeCard } from '@/components/gamification/BadgeCard';
import { useGamification } from '@/hooks/useGamification';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [role, setRole] = useState<string>('intern');
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { userLevel, updateStreak } = useGamification(user?.id);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
      updateStreak(); // Mettre à jour le streak au chargement
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      setProfile(profileData);

      // Fetch all roles for the user
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user!.id);

      if (rolesData && rolesData.length > 0) {
        // Check if user has admin role
        const hasAdminRole = rolesData.some(r => r.role === 'admin');
        
        if (hasAdminRole) {
          setRole('admin');
          navigate('/admin');
          return;
        } else {
          setRole(rolesData[0].role);
        }
      }

      // Fetch enrollments
      const { data: enrollmentsData } = await supabase
        .from('enrollments')
        .select(`
          *,
          internship_programs (*)
        `)
        .eq('user_id', user!.id);

      setEnrollments(enrollmentsData || []);

      // Fetch badges (earned badges from gamification)
      const { data: earnedBadgesData } = await supabase
        .from('user_badges' as any)
        .select(`
          *,
          badge:badges(*)
        `)
        .eq('user_id', user!.id)
        .order('earned_at', { ascending: false })
        .limit(6);

      setBadges(earnedBadgesData || []);

      // Fetch available courses
      const { data: coursesData } = await supabase
        .from('courses')
        .select('*')
        .eq('status', 'active');

      setCourses(coursesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <div className="grid md:grid-cols-3 gap-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="gradient-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="text-2xl">
                    {profile.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{profile.full_name}</h1>
                  <p className="text-muted-foreground mb-3">{profile.email}</p>
                  {profile.bio && (
                    <p className="text-sm text-muted-foreground mb-3">{profile.bio}</p>
                  )}
                  <Badge variant="secondary" className="capitalize">
                    {role}
                  </Badge>
                </div>
                <ProfileEditor profile={profile} onUpdate={fetchData} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <LevelProgress
              currentLevel={userLevel?.level || 1}
              currentXp={userLevel?.xp || 0}
              nextLevelXp={Math.pow(userLevel?.level || 1, 2) * 100}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StreakDisplay
              currentStreak={userLevel?.current_streak || 0}
              longestStreak={userLevel?.longest_streak || 0}
            />
          </motion.div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="hover-lift gradient-card border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Chapitres Complétés
                </CardTitle>
                <BookOpen className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {userLevel?.total_chapters_completed || 0}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="hover-lift gradient-card border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Badges Gagnés
                </CardTitle>
                <Award className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{badges.length}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="hover-lift gradient-card border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Soumissions
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {userLevel?.total_submissions || 0}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Badges Section */}
        {badges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="h-6 w-6 text-primary" />
                Mes Badges
              </h2>
              <Button variant="outline" onClick={() => navigate('/profile')}>
                Voir tout
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {badges.map((userBadge, index) => (
                <motion.div
                  key={userBadge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                >
                  <BadgeCard
                    badge={userBadge.badge}
                    earned={true}
                    earnedDate={userBadge.earned_at}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Available Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            Formations Disponibles
          </h2>
          {courses.length === 0 ? (
            <Card className="gradient-card border-0">
              <CardContent className="p-12 text-center">
                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Aucune formation disponible pour le moment
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <motion.div
                  key={course.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="hover-lift gradient-card border-0 overflow-hidden h-full">
                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <PlayCircle className="h-16 w-16 text-white/80" />
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {course.description || 'Formation complète et pratique'}
                      </p>
                      <Button 
                        onClick={() => navigate('/courses/flutter')}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Commencer la formation
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Active Enrollments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">Stages Actifs</h2>
          {enrollments.filter(e => e.status === 'active').length === 0 ? (
            <Card className="gradient-card border-0">
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No active internships yet. Contact your admin to get enrolled!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {enrollments
                .filter(e => e.status === 'active')
                .map((enrollment) => (
                  <Card key={enrollment.id} className="hover-lift gradient-card border-0">
                    <CardHeader>
                      <CardTitle>{enrollment.internship_programs.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {enrollment.internship_programs.domain}
                        </p>
                        <Badge>{enrollment.status}</Badge>
                        {enrollment.performance_score && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-1">Progress</p>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-smooth"
                                style={{ width: `${enrollment.performance_score}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </motion.div>

        {/* Badges Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-4">Your Badges</h2>
          {badges.length === 0 ? (
            <Card className="gradient-card border-0">
              <CardContent className="p-12 text-center">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Complete your internships to earn verified badges!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer"
                >
                  <Card className="hover-lift gradient-card border-0 badge-shine">
                    <CardContent className="p-6 text-center">
                      <div className="w-20 h-20 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Award className="h-10 w-10 text-warning" />
                      </div>
                      <h3 className="font-semibold mb-1">
                        {badge.internship_programs.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(badge.issued_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
