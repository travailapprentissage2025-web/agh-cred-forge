import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Flame, Award } from "lucide-react";

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  className?: string;
}

export const StreakDisplay = ({
  currentStreak,
  longestStreak,
  className,
}: StreakDisplayProps) => {
  return (
    <Card className={className}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{
              scale: currentStreak > 0 ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: 0.5,
              repeat: currentStreak > 0 ? Infinity : 0,
              repeatDelay: 1,
            }}
          >
            <Flame className="w-8 h-8 text-orange-500" fill="currentColor" />
          </motion.div>
          <div>
            <h3 className="font-bold text-xl">Série Actuelle</h3>
            <p className="text-sm text-muted-foreground">
              Maintenez votre rythme !
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20">
            <motion.div
              key={currentStreak}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-bold text-orange-500"
            >
              {currentStreak}
            </motion.div>
            <div className="text-xs text-muted-foreground mt-1">
              {currentStreak > 1 ? "jours" : "jour"}
            </div>
          </div>

          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-center gap-1 text-amber-500">
              <Award className="w-4 h-4" />
              <span className="text-2xl font-bold">{longestStreak}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">Record</div>
          </div>
        </div>

        {currentStreak >= 7 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30"
          >
            <p className="text-sm font-medium text-center">
              🔥 En feu ! Série de {currentStreak} jours !
            </p>
          </motion.div>
        )}
      </div>
    </Card>
  );
};
