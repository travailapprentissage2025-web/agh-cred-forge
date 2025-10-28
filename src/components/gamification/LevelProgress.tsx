import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, TrendingUp } from "lucide-react";

interface LevelProgressProps {
  currentLevel: number;
  currentXp: number;
  nextLevelXp: number;
  className?: string;
}

export const LevelProgress = ({
  currentLevel,
  currentXp,
  nextLevelXp,
  className,
}: LevelProgressProps) => {
  const progress = (currentXp / nextLevelXp) * 100;

  return (
    <Card className={className}>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Star className="w-6 h-6 text-primary-foreground" fill="currentColor" />
            </div>
            <div>
              <h3 className="font-bold text-2xl">Niveau {currentLevel}</h3>
              <p className="text-sm text-muted-foreground">
                {currentXp} / {nextLevelXp} XP
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 text-green-500">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Progress value={progress} className="h-3" />
          <p className="text-xs text-muted-foreground text-center">
            Encore {nextLevelXp - currentXp} XP pour le niveau {currentLevel + 1}
          </p>
        </div>

        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="grid grid-cols-3 gap-2 text-center text-sm"
        >
          <div className="p-2 rounded-lg bg-muted/50">
            <div className="font-bold text-primary">{currentXp}</div>
            <div className="text-xs text-muted-foreground">Total XP</div>
          </div>
          <div className="p-2 rounded-lg bg-muted/50">
            <div className="font-bold text-primary">{currentLevel}</div>
            <div className="text-xs text-muted-foreground">Niveau</div>
          </div>
          <div className="p-2 rounded-lg bg-muted/50">
            <div className="font-bold text-primary">{nextLevelXp - currentXp}</div>
            <div className="text-xs text-muted-foreground">Prochain</div>
          </div>
        </motion.div>
      </div>
    </Card>
  );
};
