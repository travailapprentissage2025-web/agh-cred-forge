import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  user_id: string;
  profile?: {
    full_name: string;
    avatar_url: string | null;
  };
  total_xp: number;
  level: number;
  rank: number;
}

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
  currentUserId?: string;
  timeRange?: "daily" | "weekly" | "allTime";
  className?: string;
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-5 h-5 text-amber-500" fill="currentColor" />;
    case 2:
      return <Medal className="w-5 h-5 text-slate-400" fill="currentColor" />;
    case 3:
      return <Award className="w-5 h-5 text-orange-600" fill="currentColor" />;
    default:
      return <span className="text-muted-foreground font-semibold">#{rank}</span>;
  }
};

export const LeaderboardTable = ({
  data,
  currentUserId,
  timeRange = "weekly",
  className,
}: LeaderboardTableProps) => {
  const timeRangeLabels = {
    daily: "Aujourd'hui",
    weekly: "Cette semaine",
    allTime: "Tous les temps",
  };

  return (
    <Card className={className}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Classement</h2>
          </div>
          <Badge variant="secondary">{timeRangeLabels[timeRange]}</Badge>
        </div>

        <div className="space-y-2">
          {data.map((entry, index) => {
            const isCurrentUser = entry.user_id === currentUserId;
            const rank = entry.rank || index + 1;

            return (
              <motion.div
                key={entry.user_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg transition-all",
                    isCurrentUser
                      ? "bg-primary/10 border-2 border-primary"
                      : "bg-muted/30 hover:bg-muted/50",
                    rank <= 3 && "shadow-md"
                  )}
                >
                  <div className="flex items-center justify-center w-12">
                    {getRankIcon(rank)}
                  </div>

                  <Avatar className="w-10 h-10">
                    <AvatarImage src={entry.profile?.avatar_url || undefined} />
                    <AvatarFallback>
                      {entry.profile?.full_name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className={cn("font-semibold truncate", isCurrentUser && "text-primary")}>
                      {entry.profile?.full_name || "Utilisateur"}
                      {isCurrentUser && " (Vous)"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Niveau {entry.level}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-lg">{entry.total_xp.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">XP</p>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {data.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucune donnée de classement pour le moment</p>
              <p className="text-sm mt-2">Soyez le premier à gagner de l'XP !</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
