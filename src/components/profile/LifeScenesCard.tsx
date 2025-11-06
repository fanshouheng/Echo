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
    <div className="space-y-8">
      {/* Daily Life Scenes */}
      {dailyLifeScenes && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Calendar className="w-6 h-6 text-primary" />
              日常生活场景
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {dailyLifeScenes.morningRoutine && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-primary">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold">早晨时光</h3>
                </div>
                <p className="text-foreground/90 leading-relaxed text-base pl-14">
                  {dailyLifeScenes.morningRoutine}
                </p>
              </div>
            )}

            {dailyLifeScenes.eveningRoutine && (
              <>
                <div className="border-t border-border/30"></div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-secondary">
                    <div className="p-2 rounded-lg bg-secondary/10">
                      <Moon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold">夜晚时光</h3>
                  </div>
                  <p className="text-foreground/90 leading-relaxed text-base pl-14">
                    {dailyLifeScenes.eveningRoutine}
                  </p>
                </div>
              </>
            )}

            {dailyLifeScenes.weekendActivity && (
              <>
                <div className="border-t border-border/30"></div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-accent">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold">周末时光</h3>
                  </div>
                  <p className="text-foreground/90 leading-relaxed text-base pl-14">
                    {dailyLifeScenes.weekendActivity}
                  </p>
                </div>
              </>
            )}

            {dailyLifeScenes.cookingTogether && (
              <>
                <div className="border-t border-border/30"></div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-primary">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Heart className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold">一起做饭</h3>
                  </div>
                  <p className="text-foreground/90 leading-relaxed text-base pl-14">
                    {dailyLifeScenes.cookingTogether}
                  </p>
                </div>
              </>
            )}

            {dailyLifeScenes.quietMoments && (
              <>
                <div className="border-t border-border/30"></div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-secondary">
                    <div className="p-2 rounded-lg bg-secondary/10">
                      <Moon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold">安静时刻</h3>
                  </div>
                  <p className="text-foreground/90 leading-relaxed text-base pl-14">
                    {dailyLifeScenes.quietMoments}
                  </p>
                </div>
              </>
            )}

            {dailyLifeScenes.playfulMoments && (
              <>
                <div className="border-t border-border/30"></div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-accent">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Heart className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold">轻松时刻</h3>
                  </div>
                  <p className="text-foreground/90 leading-relaxed text-base pl-14">
                    {dailyLifeScenes.playfulMoments}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Interaction Details */}
      {interactionDetails && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-primary" />
              TA 的互动方式
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {interactionDetails.howTheyGreet && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full"></span>
                  如何打招呼
                </h3>
                <p className="text-foreground/90 leading-relaxed text-base pl-3">
                  {interactionDetails.howTheyGreet}
                </p>
              </div>
            )}

            {interactionDetails.howTheySayGoodbye && (
              <>
                <div className="border-t border-border/30"></div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-secondary flex items-center gap-2">
                    <span className="w-1 h-5 bg-secondary rounded-full"></span>
                    如何告别
                  </h3>
                  <p className="text-foreground/90 leading-relaxed text-base pl-3">
                    {interactionDetails.howTheySayGoodbye}
                  </p>
                </div>
              </>
            )}

            {interactionDetails.howTheyShowCare && (
              <>
                <div className="border-t border-border/30"></div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-accent flex items-center gap-2">
                    <span className="w-1 h-5 bg-accent rounded-full"></span>
                    如何表达关心
                  </h3>
                  <p className="text-foreground/90 leading-relaxed text-base pl-3">
                    {interactionDetails.howTheyShowCare}
                  </p>
                </div>
              </>
            )}

            {interactionDetails.howTheyApologize && (
              <>
                <div className="border-t border-border/30"></div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                    <span className="w-1 h-5 bg-primary rounded-full"></span>
                    如何道歉
                  </h3>
                  <p className="text-foreground/90 leading-relaxed text-base pl-3">
                    {interactionDetails.howTheyApologize}
                  </p>
                </div>
              </>
            )}

            {interactionDetails.howTheyCelebrate && (
              <>
                <div className="border-t border-border/30"></div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-secondary flex items-center gap-2">
                    <span className="w-1 h-5 bg-secondary rounded-full"></span>
                    如何庆祝
                  </h3>
                  <p className="text-foreground/90 leading-relaxed text-base pl-3">
                    {interactionDetails.howTheyCelebrate}
                  </p>
                </div>
              </>
            )}

            {interactionDetails.howTheyComfort && (
              <>
                <div className="border-t border-border/30"></div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-accent flex items-center gap-2">
                    <span className="w-1 h-5 bg-accent rounded-full"></span>
                    如何安慰
                  </h3>
                  <p className="text-foreground/90 leading-relaxed text-base pl-3">
                    {interactionDetails.howTheyComfort}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Living Together */}
      {livingTogether && (
        <Card className="border-border/50 bg-gradient-to-br from-card/50 to-primary/5 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Home className="w-6 h-6 text-primary" />
              一起生活的场景
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {livingTogether.morningScene && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full"></span>
                  早晨
                </h3>
                <p className="text-foreground/90 leading-relaxed text-base pl-3">
                  {livingTogether.morningScene}
                </p>
              </div>
            )}

            {livingTogether.eveningScene && (
              <>
                <div className="border-t border-border/30"></div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-secondary flex items-center gap-2">
                    <span className="w-1 h-5 bg-secondary rounded-full"></span>
                    晚上
                  </h3>
                  <p className="text-foreground/90 leading-relaxed text-base pl-3">
                    {livingTogether.eveningScene}
                  </p>
                </div>
              </>
            )}

            {livingTogether.weekendScene && (
              <>
                <div className="border-t border-border/30"></div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-accent flex items-center gap-2">
                    <span className="w-1 h-5 bg-accent rounded-full"></span>
                    周末
                  </h3>
                  <p className="text-foreground/90 leading-relaxed text-base pl-3">
                    {livingTogether.weekendScene}
                  </p>
                </div>
              </>
            )}

            {livingTogether.choreDistribution && (
              <>
                <div className="border-t border-border/30"></div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                    <span className="w-1 h-5 bg-primary rounded-full"></span>
                    家务分工
                  </h3>
                  <p className="text-foreground/90 leading-relaxed text-base pl-3">
                    {livingTogether.choreDistribution}
                  </p>
                </div>
              </>
            )}

            {livingTogether.personalSpace && (
              <>
                <div className="border-t border-border/30"></div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-secondary flex items-center gap-2">
                    <span className="w-1 h-5 bg-secondary rounded-full"></span>
                    个人空间
                  </h3>
                  <p className="text-foreground/90 leading-relaxed text-base pl-3">
                    {livingTogether.personalSpace}
                  </p>
                </div>
              </>
            )}

            {livingTogether.sharedActivities && livingTogether.sharedActivities.length > 0 && (
              <>
                <div className="border-t border-border/30"></div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-accent flex items-center gap-2">
                    <span className="w-1 h-5 bg-accent rounded-full"></span>
                    共同活动
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {livingTogether.sharedActivities.map((activity, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 rounded-lg bg-primary/10 text-foreground/90 hover:bg-primary/15 transition-colors"
                      >
                        {activity}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Deeper Traits */}
      {deeperTraits && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Heart className="w-6 h-6 text-primary" />
              TA 的更多细节
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {deeperTraits.hiddenTalents && deeperTraits.hiddenTalents.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full"></span>
                  隐藏的小才能
                </h3>
                <ul className="list-none space-y-2 text-foreground/90 pl-3">
                  {deeperTraits.hiddenTalents.map((talent, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1.5">•</span>
                      <span className="flex-1 leading-relaxed">{talent}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {deeperTraits.quirks && deeperTraits.quirks.length > 0 && (
              <>
                <div className="border-t border-border/30"></div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-secondary flex items-center gap-2">
                    <span className="w-1 h-5 bg-secondary rounded-full"></span>
                    独特的小习惯
                  </h3>
                  <ul className="list-none space-y-2 text-foreground/90 pl-3">
                    {deeperTraits.quirks.map((quirk, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-secondary mt-1.5">•</span>
                        <span className="flex-1 leading-relaxed">{quirk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {deeperTraits.petPeeves && deeperTraits.petPeeves.length > 0 && (
              <>
                <div className="border-t border-border/30"></div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-accent flex items-center gap-2">
                    <span className="w-1 h-5 bg-accent rounded-full"></span>
                    小介意的事
                  </h3>
                  <ul className="list-none space-y-2 text-foreground/90 pl-3">
                    {deeperTraits.petPeeves.map((peeve, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-accent mt-1.5">•</span>
                        <span className="flex-1 leading-relaxed">{peeve}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {deeperTraits.randomFacts && deeperTraits.randomFacts.length > 0 && (
              <>
                <div className="border-t border-border/30"></div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                    <span className="w-1 h-5 bg-primary rounded-full"></span>
                    关于TA的随机事实
                  </h3>
                  <ul className="list-none space-y-2 text-foreground/90 pl-3">
                    {deeperTraits.randomFacts.map((fact, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span className="flex-1 leading-relaxed">{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Conversation Examples */}
      {conversationExamples && (
        <Card className="border-border/50 bg-gradient-to-br from-card/50 to-secondary/5 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-primary" />
              TA 的对话示例
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {conversationExamples.dailyCheckIn && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full"></span>
                  日常问候
                </h3>
                <div className="p-5 rounded-lg bg-primary/10 text-foreground/90 whitespace-pre-line leading-relaxed text-base border-l-4 border-primary">
                  {conversationExamples.dailyCheckIn}
                </div>
              </div>
            )}

            {conversationExamples.deepTalk && (
              <>
                <div className="border-t border-border/30"></div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-secondary flex items-center gap-2">
                    <span className="w-1 h-5 bg-secondary rounded-full"></span>
                    深度交流
                  </h3>
                  <div className="p-5 rounded-lg bg-secondary/10 text-foreground/90 whitespace-pre-line leading-relaxed text-base border-l-4 border-secondary">
                    {conversationExamples.deepTalk}
                  </div>
                </div>
              </>
            )}

            {conversationExamples.playfulTeasing && (
              <>
                <div className="border-t border-border/30"></div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-accent flex items-center gap-2">
                    <span className="w-1 h-5 bg-accent rounded-full"></span>
                    轻松调侃
                  </h3>
                  <div className="p-5 rounded-lg bg-accent/10 text-foreground/90 whitespace-pre-line leading-relaxed text-base border-l-4 border-accent">
                    {conversationExamples.playfulTeasing}
                  </div>
                </div>
              </>
            )}

            {conversationExamples.conflictExample && (
              <>
                <div className="border-t border-border/30"></div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                    <span className="w-1 h-5 bg-primary rounded-full"></span>
                    冲突时的对话
                  </h3>
                  <div className="p-5 rounded-lg bg-primary/10 text-foreground/90 whitespace-pre-line leading-relaxed text-base border-l-4 border-primary">
                    {conversationExamples.conflictExample}
                  </div>
                </div>
              </>
            )}

            {conversationExamples.supportiveWords && (
              <>
                <div className="border-t border-border/30"></div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-secondary flex items-center gap-2">
                    <span className="w-1 h-5 bg-secondary rounded-full"></span>
                    支持性话语
                  </h3>
                  <div className="p-5 rounded-lg bg-secondary/10 text-foreground/90 whitespace-pre-line leading-relaxed text-base border-l-4 border-secondary">
                    {conversationExamples.supportiveWords}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

