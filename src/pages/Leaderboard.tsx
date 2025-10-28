import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { LoadingPage } from "@/components/LoadingPage";
import { LeaderboardTable } from "@/components/gamification/LeaderboardTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function Leaderboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [allTimeData, setAllTimeData] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchLeaderboardData();
    }
  }, [user]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);

      // Fetch weekly leaderboard
      const { data: weeklyLeaderboard } = await supabase
        .from("user_levels" as any)
        .select(`
          user_id,
          xp,
          level,
          profile:profiles(full_name, avatar_url)
        `)
        .order("xp", { ascending: false })
        .limit(50);

      if (weeklyLeaderboard) {
        const withRanks = weeklyLeaderboard.map((entry: any, index: number) => ({
          ...entry,
          total_xp: entry.xp,
          rank: index + 1,
        }));
        setWeeklyData(withRanks);
        setAllTimeData(withRanks);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">🏆 Classement</h1>
            <p className="text-muted-foreground">
              Comparez vos performances avec les autres apprenants
            </p>
          </div>

          <Tabs defaultValue="weekly" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="weekly">Cette semaine</TabsTrigger>
              <TabsTrigger value="allTime">Tous les temps</TabsTrigger>
            </TabsList>

            <TabsContent value="weekly">
              <LeaderboardTable
                data={weeklyData}
                currentUserId={user?.id}
                timeRange="weekly"
              />
            </TabsContent>

            <TabsContent value="allTime">
              <LeaderboardTable
                data={allTimeData}
                currentUserId={user?.id}
                timeRange="allTime"
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
