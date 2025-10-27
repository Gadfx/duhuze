import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Settings, X } from "lucide-react";

interface PreferencesSetupProps {
  userId: string;
  onClose: () => void;
}

const PreferencesSetup = ({ userId, onClose }: PreferencesSetupProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [ageMin, setAgeMin] = useState("18");
  const [ageMax, setAgeMax] = useState("100");
  const [preferredGender, setPreferredGender] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const [videoBlur, setVideoBlur] = useState(false);
  const [voiceOnly, setVoiceOnly] = useState(false);
  const [selfDestruct, setSelfDestruct] = useState(false);

  const interestSuggestions = [
    "Music",
    "Sports",
    "Movies",
    "Technology",
    "Travel",
    "Food",
    "Art",
    "Fashion",
    "Gaming",
    "Reading",
  ];

  const addInterest = (interest: string) => {
    if (interest && !interests.includes(interest)) {
      setInterests([...interests, interest]);
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("user_preferences")
        .upsert({
          user_id: userId,
          age_min: parseInt(ageMin),
          age_max: parseInt(ageMax),
          preferred_gender: (preferredGender as "male" | "female" | "non_binary" | "prefer_not_to_say") || null,
          interests,
          enable_video_blur: videoBlur,
          voice_only_mode: voiceOnly,
          self_destructing_messages: selfDestruct,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Preferences Saved",
        description: "Your matching preferences have been updated!",
      });

      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 shadow-glow max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Matching Preferences</h2>
              <p className="text-sm text-muted-foreground">Customize your connection settings</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label>Age Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age-min" className="text-sm text-muted-foreground">Minimum</Label>
                <Select value={ageMin} onValueChange={setAgeMin}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 83 }, (_, i) => i + 18).map((age) => (
                      <SelectItem key={age} value={age.toString()}>
                        {age}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="age-max" className="text-sm text-muted-foreground">Maximum</Label>
                <Select value={ageMax} onValueChange={setAgeMax}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 83 }, (_, i) => i + 18).map((age) => (
                      <SelectItem key={age} value={age.toString()}>
                        {age}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preferred Gender</Label>
            <Select value={preferredGender} onValueChange={setPreferredGender}>
              <SelectTrigger>
                <SelectValue placeholder="No preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No preference</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non_binary">Non-Binary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Interests</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {interests.map((interest) => (
                <Badge
                  key={interest}
                  variant="secondary"
                  className="gap-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeInterest(interest)}
                >
                  {interest}
                  <X className="w-3 h-3" />
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {interestSuggestions
                .filter((s) => !interests.includes(s))
                .map((suggestion) => (
                  <Badge
                    key={suggestion}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => addInterest(suggestion)}
                  >
                    + {suggestion}
                  </Badge>
                ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <Label className="text-base font-semibold">Privacy Settings</Label>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="video-blur">Video Blur</Label>
                <p className="text-sm text-muted-foreground">Blur your video until you consent</p>
              </div>
              <Switch
                id="video-blur"
                checked={videoBlur}
                onCheckedChange={setVideoBlur}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="voice-only">Voice Only Mode</Label>
                <p className="text-sm text-muted-foreground">Disable video completely</p>
              </div>
              <Switch
                id="voice-only"
                checked={voiceOnly}
                onCheckedChange={setVoiceOnly}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="self-destruct">Self-Destructing Messages</Label>
                <p className="text-sm text-muted-foreground">Messages disappear after viewing</p>
              </div>
              <Switch
                id="self-destruct"
                checked={selfDestruct}
                onCheckedChange={setSelfDestruct}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-hero text-white hover:shadow-glow transition-all"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Preferences"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default PreferencesSetup;
