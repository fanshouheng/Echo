/**
 * LifeScenesCard Component
 * Display detailed life scenes and interactions
 */

"use client";

import { PartnerPersonalityProfile } from "@/types/partner-personality";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Coffee, Moon, Calendar, Home, MessageSquare } from "lucide-react";

interface LifeScenesCardProps {
  partner: PartnerPersonalityProfile;
}

export function LifeScenesCard({ partner }: LifeScenesCardProps) {
  const { dailyLifeScenes, interactionDetails, livingTogether, deeperTraits, conversationExamples } = partner;

  return (
    <div className="space-y-6">
      {/* Daily Life Scenes */}
      {dailyLifeScenes && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" />
              日常生活场景
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {dailyLifeScenes.morningRoutine && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Coffee className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">早晨时光</h3>
                </div>
                <p className="text-foreground/90 leading-relaxed pl-7">
                  {dailyLifeScenes.morningRoutine}
                </p>
              </div>
            )}

            {dailyLifeScenes.eveningRoutine && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-secondary">
                  <Moon className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">夜晚时光</h3>
                </div>
                <p className="text-foreground/90 leading-relaxed pl-7">
                  {dailyLifeScenes.eveningRoutine}
                </p>
              </div>
            )}

            {dailyLifeScenes.weekendActivity && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-accent">
                  <Calendar className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">周末时光</h3>
                </div>
                <p className="text-foreground/90 leading-relaxed pl-7">
                  {dailyLifeScenes.weekendActivity}
                </p>
              </div>
            )}

            {dailyLifeScenes.cookingTogether && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Heart className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">一起做饭</h3>
                </div>
                <p className="text-foreground/90 leading-relaxed pl-7">
                  {dailyLifeScenes.cookingTogether}
                </p>
              </div>
            )}

            {dailyLifeScenes.quietMoments && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-secondary">
                  <Moon className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">安静时刻</h3>
                </div>
                <p className="text-foreground/90 leading-relaxed pl-7">
                  {dailyLifeScenes.quietMoments}
                </p>
              </div>
            )}

            {dailyLifeScenes.playfulMoments && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-accent">
                  <Heart className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">轻松时刻</h3>
                </div>
                <p className="text-foreground/90 leading-relaxed pl-7">
                  {dailyLifeScenes.playfulMoments}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Interaction Details */}
      {interactionDetails && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary" />
              TA 的互动方式
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {interactionDetails.howTheyGreet && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary">如何打招呼</h3>
                <p className="text-foreground/90 leading-relaxed">
                  {interactionDetails.howTheyGreet}
                </p>
              </div>
            )}

            {interactionDetails.howTheySayGoodbye && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-secondary">如何告别</h3>
                <p className="text-foreground/90 leading-relaxed">
                  {interactionDetails.howTheySayGoodbye}
                </p>
              </div>
            )}

            {interactionDetails.howTheyShowCare && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-accent">如何表达关心</h3>
                <p className="text-foreground/90 leading-relaxed">
                  {interactionDetails.howTheyShowCare}
                </p>
              </div>
            )}

            {interactionDetails.howTheyApologize && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary">如何道歉</h3>
                <p className="text-foreground/90 leading-relaxed">
                  {interactionDetails.howTheyApologize}
                </p>
              </div>
            )}

            {interactionDetails.howTheyCelebrate && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-secondary">如何庆祝</h3>
                <p className="text-foreground/90 leading-relaxed">
                  {interactionDetails.howTheyCelebrate}
                </p>
              </div>
            )}

            {interactionDetails.howTheyComfort && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-accent">如何安慰</h3>
                <p className="text-foreground/90 leading-relaxed">
                  {interactionDetails.howTheyComfort}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Living Together */}
      {livingTogether && (
        <Card className="border-border/50 bg-gradient-to-br from-card/50 to-primary/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Home className="w-6 h-6 text-primary" />
              一起生活的场景
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {livingTogether.morningScene && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary">早晨</h3>
                <p className="text-foreground/90 leading-relaxed">
                  {livingTogether.morningScene}
                </p>
              </div>
            )}

            {livingTogether.eveningScene && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-secondary">晚上</h3>
                <p className="text-foreground/90 leading-relaxed">
                  {livingTogether.eveningScene}
                </p>
              </div>
            )}

            {livingTogether.weekendScene && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-accent">周末</h3>
                <p className="text-foreground/90 leading-relaxed">
                  {livingTogether.weekendScene}
                </p>
              </div>
            )}

            {livingTogether.choreDistribution && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary">家务分工</h3>
                <p className="text-foreground/90 leading-relaxed">
                  {livingTogether.choreDistribution}
                </p>
              </div>
            )}

            {livingTogether.personalSpace && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-secondary">个人空间</h3>
                <p className="text-foreground/90 leading-relaxed">
                  {livingTogether.personalSpace}
                </p>
              </div>
            )}

            {livingTogether.sharedActivities && livingTogether.sharedActivities.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-accent">共同活动</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {livingTogether.sharedActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 rounded-lg bg-primary/10 text-foreground/90"
                    >
                      {activity}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Deeper Traits */}
      {deeperTraits && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary" />
              TA 的更多细节
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {deeperTraits.hiddenTalents && deeperTraits.hiddenTalents.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary">隐藏的小才能</h3>
                <ul className="list-disc list-inside space-y-1 text-foreground/90">
                  {deeperTraits.hiddenTalents.map((talent, index) => (
                    <li key={index}>{talent}</li>
                  ))}
                </ul>
              </div>
            )}

            {deeperTraits.quirks && deeperTraits.quirks.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-secondary">独特的小习惯</h3>
                <ul className="list-disc list-inside space-y-1 text-foreground/90">
                  {deeperTraits.quirks.map((quirk, index) => (
                    <li key={index}>{quirk}</li>
                  ))}
                </ul>
              </div>
            )}

            {deeperTraits.petPeeves && deeperTraits.petPeeves.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-accent">小介意的事</h3>
                <ul className="list-disc list-inside space-y-1 text-foreground/90">
                  {deeperTraits.petPeeves.map((peeve, index) => (
                    <li key={index}>{peeve}</li>
                  ))}
                </ul>
              </div>
            )}

            {deeperTraits.randomFacts && deeperTraits.randomFacts.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary">关于TA的随机事实</h3>
                <ul className="list-disc list-inside space-y-1 text-foreground/90">
                  {deeperTraits.randomFacts.map((fact, index) => (
                    <li key={index}>{fact}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Conversation Examples */}
      {conversationExamples && (
        <Card className="border-border/50 bg-gradient-to-br from-card/50 to-secondary/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary" />
              TA 的对话示例
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {conversationExamples.dailyCheckIn && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary">日常问候</h3>
                <div className="p-4 rounded-lg bg-primary/10 text-foreground/90 whitespace-pre-line leading-relaxed">
                  {conversationExamples.dailyCheckIn}
                </div>
              </div>
            )}

            {conversationExamples.deepTalk && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-secondary">深度交流</h3>
                <div className="p-4 rounded-lg bg-secondary/10 text-foreground/90 whitespace-pre-line leading-relaxed">
                  {conversationExamples.deepTalk}
                </div>
              </div>
            )}

            {conversationExamples.playfulTeasing && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-accent">轻松调侃</h3>
                <div className="p-4 rounded-lg bg-accent/10 text-foreground/90 whitespace-pre-line leading-relaxed">
                  {conversationExamples.playfulTeasing}
                </div>
              </div>
            )}

            {conversationExamples.conflictExample && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary">冲突时的对话</h3>
                <div className="p-4 rounded-lg bg-primary/10 text-foreground/90 whitespace-pre-line leading-relaxed">
                  {conversationExamples.conflictExample}
                </div>
              </div>
            )}

            {conversationExamples.supportiveWords && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-secondary">支持性话语</h3>
                <div className="p-4 rounded-lg bg-secondary/10 text-foreground/90 whitespace-pre-line leading-relaxed">
                  {conversationExamples.supportiveWords}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

