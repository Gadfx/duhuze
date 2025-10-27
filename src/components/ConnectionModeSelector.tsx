import { Card } from "@/components/ui/card";
import { Shuffle, Heart, Users } from "lucide-react";

interface ConnectionModeSelectorProps {
  onSelect: (mode: string) => void;
}

const ConnectionModeSelector = ({ onSelect }: ConnectionModeSelectorProps) => {
  const modes = [
    {
      id: "random",
      name: "Random Match",
      description: "Connect with anyone, anytime",
      icon: Shuffle,
      gradient: "bg-gradient-hero",
    },
    {
      id: "interest_based",
      name: "Interest-Based",
      description: "Find people who share your interests",
      icon: Heart,
      gradient: "bg-gradient-warm",
    },
    {
      id: "group_room",
      name: "Group Rooms",
      description: "Join themed conversation rooms",
      icon: Users,
      gradient: "bg-gradient-hero",
      disabled: true, // Not implemented yet
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">How Would You Like to Connect?</h1>
          <p className="text-muted-foreground">Choose your preferred connection mode</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Card
                key={mode.id}
                className={`p-6 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                  mode.disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:shadow-glow"
                }`}
                onClick={() => !mode.disabled && onSelect(mode.id)}
              >
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${mode.gradient} rounded-2xl mb-4 shadow-soft`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{mode.name}</h3>
                  <p className="text-sm text-muted-foreground">{mode.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ConnectionModeSelector;
