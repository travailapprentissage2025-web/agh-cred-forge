import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AchievementToastProps {
  badge: {
    name: string;
    icon: string;
    rarity: string;
    points: number;
  } | null;
  show: boolean;
  onHide: () => void;
}

const rarityColors = {
  common: "from-slate-500 to-slate-600",
  rare: "from-blue-500 to-blue-600",
  epic: "from-purple-500 to-purple-600",
  legendary: "from-amber-500 to-amber-600",
};

export const AchievementToast = ({ badge, show, onHide }: AchievementToastProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  return (
    <AnimatePresence>
      {show && badge && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className="fixed top-4 right-4 z-50 w-80"
        >
          <div
            className={`bg-gradient-to-r ${
              rarityColors[badge.rarity as keyof typeof rarityColors]
            } p-1 rounded-lg shadow-2xl`}
          >
            <div className="bg-background rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-sm">Badge débloqué !</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={onHide}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="text-4xl"
                >
                  {badge.icon}
                </motion.div>
                <div>
                  <p className="font-semibold">{badge.name}</p>
                  <p className="text-sm text-muted-foreground">+{badge.points} XP</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 0] }}
            transition={{ duration: 1, times: [0, 0.5, 1] }}
            className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-lg blur-xl"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
