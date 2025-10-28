import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { LoadingPage } from "@/components/LoadingPage";
import { ProfileEditor } from "@/components/ProfileEditor";
import { BadgeCard } from "@/components/gamification/BadgeCard";
import { LevelProgress } from "@/components/gamification/LevelProgress";
import { StreakDisplay } from "@/components/gamification/StreakDisplay";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Award, BookOpen, Trophy } from "lucide-react";

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [userLevel, setUserLevel] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [allBadges, setAllBadges] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();

      setProfile(profileData);

      // Fetch user level
      const { data: levelData } = await supabase
        .from("user_levels" as any)
        .select("*")
        .eq("user_id", user!.id)
        .single();

      if (levelData) {
        setUserLevel(levelData);
      }

      // Fetch user badges
      const { data: userBadgesData } = await supabase
        .from("user_badges" as any)
        .select(`
          *,
          badge:badges(*)
        `)
        .eq("user_id", user!.id)
        .order("earned_at", { ascending: false });

      setBadges(userBadgesData || []);

      // Fetch all badges
      const { data: allBadgesData } = await supabase
        .from("badges" as any)
        .select("*")
        .order("rarity", { ascending: false });

      setAllBadges(allBadgesData || []);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingPage />;
  }

  const earnedBadgeIds = badges.map((b) => b.badge_id);
  const nextLevelXp = Math.pow(userLevel?.level || 1, 2) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <Avatar className="w-32 h-32">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="text-4xl">
                  {profile?.full_name?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2">{profile?.full_name}</h1>
                <p className="text-muted-foreground mb-4">{profile?.email}</p>
                {profile?.bio && (
                  <p className="text-sm text-muted-foreground max-w-2xl">{profile.bio}</p>
                )}
                <div className="mt-4">
                  <ProfileEditor profile={profile} onUpdate={fetchProfileData} />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <LevelProgress
              currentLevel={userLevel?.level || 1}
              currentXp={userLevel?.xp || 0}
              nextLevelXp={nextLevelXp}
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h3 className="font-bold">Statistiques</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">
                      {userLevel?.total_chapters_completed || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Chapitres</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">
                      {userLevel?.total_submissions || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Soumissions</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <Tabs defaultValue="earned">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Badges</h2>
                </div>
                <TabsList>
                  <TabsTrigger value="earned">
                    Obtenus ({badges.length})
                  </TabsTrigger>
                  <TabsTrigger value="all">
                    Tous ({allBadges.length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="earned">
                {badges.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {badges.map((userBadge, index) => (
                      <motion.div
                        key={userBadge.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <BadgeCard
                          badge={userBadge.badge}
                          earned={true}
                          earnedDate={userBadge.earned_at}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Vous n'avez pas encore de badges</p>
                    <p className="text-sm mt-2">Complétez des chapitres pour en gagner !</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="all">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {allBadges.map((badge, index) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <BadgeCard
                        badge={badge}
                        earned={earnedBadgeIds.includes(badge.id)}
                        earnedDate={
                          badges.find((b) => b.badge_id === badge.id)?.earned_at
                        }
                      />
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
