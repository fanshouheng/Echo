/**
 * TraitDetails Component
 * Display unique traits and quirks
 */

"use client";

import { PersonalityProfile } from "@/types/personality";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface TraitDetailsProps {
  personality: PersonalityProfile;
}

export function TraitDetails({ personality }: TraitDetailsProps) {
  return (
    <Card className="border-border/50 bg-gradient-to-br from-card/50 to-primary/5 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-3">
          <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          TA 的独特之处
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Unique Traits */}
        <div className="space-y-3">
          <p className="text-foreground/90 leading-relaxed text-sm md:text-base whitespace-pre-line">
            {personality.uniqueTraits}
          </p>
        </div>

        {/* Quote Section (if unique traits contains a quote) */}
        {personality.uniqueTraits.includes("专属语录") && (
          <div className="pt-4 border-t border-border/30">
            <blockquote className="text-base md:text-lg italic text-primary/90 border-l-4 border-primary pl-4 md:pl-6 py-2 bg-primary/5 rounded-r-lg">
              {personality.uniqueTraits.split("专属语录：")[1]?.replace(/["']/g, "")}
            </blockquote>
          </div>
        )}

        {/* Keyword Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {personality.keywords.map((keyword, index) => (
            <span
              key={index}
              className="px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              {keyword}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

