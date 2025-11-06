/**
 * PersonalityCard Component
 * Display personality profile summary
 */

"use client";

import { PersonalityProfile } from "@/types/personality";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PersonalityCardProps {
  personality: PersonalityProfile;
}

export function PersonalityCard({ personality }: PersonalityCardProps) {
  return (
    <Card className="border-border/50 bg-gradient-to-br from-card/50 to-primary/5 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          关于 {personality.name}
        </CardTitle>
        <CardDescription className="text-base md:text-lg text-muted-foreground leading-relaxed">
          {personality.tagline}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/90 leading-relaxed text-sm md:text-base">
          {personality.communicationStyle}
        </p>
      </CardContent>
    </Card>
  );
}

