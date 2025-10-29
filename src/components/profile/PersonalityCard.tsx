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
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-foreground">
          关于 {personality.name}
        </CardTitle>
        <CardDescription className="text-lg">{personality.tagline}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Communication Style */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-primary">沟通风格</h3>
          <p className="text-foreground/90 leading-relaxed">
            {personality.communicationStyle}
          </p>
        </div>

        {/* Values */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-secondary">价值观</h3>
          <p className="text-foreground/90 leading-relaxed">{personality.values}</p>
        </div>

        {/* Why Match */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-accent">为什么是TA</h3>
          <p className="text-foreground/90 leading-relaxed">{personality.whyMatch}</p>
        </div>
      </CardContent>
    </Card>
  );
}

