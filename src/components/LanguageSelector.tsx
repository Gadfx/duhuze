import { Card } from "@/components/ui/card";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  onSelect: (language: string) => void;
}

const LanguageSelector = ({ onSelect }: LanguageSelectorProps) => {
  const languages = [
    { code: "rw", name: "Kinyarwanda", nativeName: "Ikinyarwanda" },
    { code: "fr", name: "French", nativeName: "Français" },
    { code: "en", name: "English", nativeName: "English" },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-hero rounded-2xl mb-4 shadow-glow">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Choose Your Language</h1>
          <p className="text-muted-foreground">Hitamo ururimi rwawe • Choisissez votre langue</p>
        </div>

        <div className="space-y-3">
          {languages.map((language) => (
            <Card
              key={language.code}
              className="p-6 cursor-pointer hover:shadow-glow transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => onSelect(language.code)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{language.name}</h3>
                  <p className="text-muted-foreground">{language.nativeName}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">{language.code.toUpperCase()}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
