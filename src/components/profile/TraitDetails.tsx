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
    <Card className="border-border/50 bg-gradient-to-br from-card/50 to-primary/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          TA 的独特之处
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Unique Traits */}
        <div className="space-y-3">
          <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
            {personality.uniqueTraits}
          </p>
        </div>

        {/* Quote Section (if unique traits contains a quote) */}
        {personality.uniqueTraits.includes("专属语录") && (
          <div className="pt-4 border-t border-border/50">
            <blockquote className="text-lg italic text-primary/80 border-l-4 border-primary pl-4">
              {personality.uniqueTraits.split("专属语录：")[1]?.replace(/["']/g, "")}
            </blockquote>
          </div>
        )}

        {/* Keyword Pills */}
        <div className="flex flex-wrap gap-2 pt-4">
          {personality.keywords.map((keyword, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
            >
              {keyword}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

