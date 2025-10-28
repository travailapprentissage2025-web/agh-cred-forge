import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

interface BadgeCardProps {
  badge: {
    id: string;
    name: string;
    description: string | null;
    icon: string;
    rarity: string;
    points: number;
  };
  earned?: boolean;
  earnedDate?: string;
  className?: string;
}

const rarityStyles = {
  common: "from-slate-500 to-slate-600",
  rare: "from-blue-500 to-blue-600",
  epic: "from-purple-500 to-purple-600",
  legendary: "from-amber-500 to-amber-600",
};

export const BadgeCard = ({ badge, earned = false, earnedDate, className }: BadgeCardProps) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: earned ? 1.05 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "relative overflow-hidden p-4 transition-all",
          earned ? "cursor-pointer hover:shadow-lg" : "opacity-50",
          className
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-10",
            rarityStyles[badge.rarity as keyof typeof rarityStyles] || rarityStyles.common
          )}
        />
        
        <div className="relative z-10 flex flex-col items-center gap-2 text-center">
          <div className="relative">
            <span className="text-4xl">{badge.icon}</span>
            {!earned && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                <Lock className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-sm">{badge.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <span className={cn(
              "px-2 py-1 rounded-full font-medium",
              `bg-gradient-to-r ${rarityStyles[badge.rarity as keyof typeof rarityStyles]}`,
              "text-white"
            )}>
              {badge.rarity}
            </span>
            <span className="text-muted-foreground">{badge.points} XP</span>
          </div>
          
          {earned && earnedDate && (
            <p className="text-xs text-muted-foreground">
              Obtenu le {new Date(earnedDate).toLocaleDateString('fr-FR')}
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
