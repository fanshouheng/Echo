/**
 * Professional Personality Generation Prompts
 * Based on Big Five + Real-life scenarios
 * Output: Grounded, practical, detailed personality profiles
 */

import { InterviewAnswer } from "@/types/interview";
import { professionalQuestions } from "@/data/questions-professional";

/**
 * System prompt for professional personality generation
 */
export const professionalSystemPrompt = `你是一位专业的心理学家，擅长基于 Big Five 人格理论（五大人格特质）进行人格分析。

**你的专业背景：**
- Big Five 理论：开放性、尽责性、外向性、宜人性、神经质
- 行为心理学：从具体行为推断性格特质
- 生活场景分析：理解日常习惯背后的心理模式

**你的任务：**
基于用户的访谈回答，创造一个与其契合的 "Echo" 人格。这个 Echo 是：
1. 真实的人，不是理想化的完美形象
2. 有具体的生活习惯和行为模式
3. 描述要有生活气息，同时保持温柔、有美感的表达
4. 注重实际相处的细节场景，用有画面感的语言呈现

**输出风格要求：**
- ✅ 文艺与生活气息并存：既要有温度和美感，又要具体可感
- ✅ 使用生活化的细节，但用温柔、有画面感的语言表达
- ❌ 避免空洞的诗意："如星河般深邃"、"灵魂的共鸣"（太抽象）
- ✅ 提倡有细节的文艺："会在深夜给你发长消息，像是把白天攒下的话，在月光下慢慢说给你听"

**示例对比：**
- 过度文艺（❌）："TA 如同午后的暖阳，温柔却不刺眼，用沉默拥抱你的悲伤"
- 过于直白（❌）："你难过时，TA 会陪着你，不问原因，递纸巾"
- 文艺+生活（✅）："你难过时，TA 会安静坐在你旁边，不问原因。偶尔递个纸巾，像递一份无声的理解。等你准备好了，就听你慢慢说"

**输出格式：**
必须严格按照 JSON schema 输出，所有字段必须填写，不能省略。`;

/**
 * Build professional personality generation prompt
 */
export function buildProfessionalPersonalityPrompt(answers: InterviewAnswer[]): string {
  // Organize answers by category
  const answersByCategory: Record<string, string[]> = {};

  answers.forEach((answer) => {
    const question = professionalQuestions.find((q) => q.id === answer.questionId);
    if (!question) return;

    const category = question.category || "other";
    if (!answersByCategory[category]) {
      answersByCategory[category] = [];
    }

    let answerText = "";
    if (Array.isArray(answer.answer)) {
      answerText = answer.answer.join(", ");
    } else {
      answerText = answer.answer;
    }

    answersByCategory[category].push(`${question.text} → ${answerText}`);
  });

  // Build structured prompt
  const categorySummary = Object.entries(answersByCategory)
    .map(([category, answers]) => {
      const categoryName = {
        lifestyle: "生活方式与习惯",
        social: "社交模式",
        decision: "决策与计划",
        emotion: "情绪与压力",
        openness: "开放性与好奇心",
        communication: "沟通风格",
        values: "价值观与关系",
      }[category] || category;

      return `### ${categoryName}\n${answers.join("\n")}`;
    })
    .join("\n\n");

  return `用户完成了一次基于 Big Five 人格理论的深度访谈。以下是他们的回答：

${categorySummary}

---

**请基于这些回答，生成一个与用户契合的 Echo 人格档案。**

**分析步骤：**
1. 从回答中提取 Big Five 各维度的分数（1-10分）
2. 识别用户的生活方式、习惯、偏好
3. 分析用户的情感需求和相处模式
4. 创造一个与用户互补或相似的 Echo 人格

**关键原则：**
- 基于实际回答，不要臆造信息
- 描述要具体、行为化、场景化
- 避免文艺化和抽象表达
- Echo 应该是真实的人，有优点也有小缺点
- 性别不限，自动匹配用户需求

**输出 JSON 格式：**

\`\`\`json
{
  "name": "陈默",
  "nickname": "小默",
  "age": "25-30",
  "vibe": "沉稳可靠",
  "tagline": "话不多，但句句在点上",
  
  "bigFive": {
    "openness": 7,
    "conscientiousness": 8,
    "extraversion": 4,
    "agreeableness": 7,
    "neuroticism": 3
  },
  
  "lifeDetails": {
    "routine": {
      "sleepPattern": "早睡早起",
      "weekendStyle": ["宅家", "学习", "运动"],
      "roomTidiness": "非常整洁"
    },
    "social": {
      "energySource": "独处充电",
      "socialMediaStyle": "很少发",
      "problemSolvingStyle": "自己解决",
      "friendCircleSize": "朋友不多但很深"
    },
    "decision": {
      "planningStyle": "详细规划",
      "taskHandling": "按优先级",
      "travelPrep": "提前攻略"
    },
    "emotion": {
      "stressResponse": "冷静应对",
      "copingMethods": ["运动", "睡觉"],
      "criticismReaction": "虚心接受"
    },
    "interests": {
      "attitudeToNew": "感兴趣会试",
      "hobbyTypes": ["运动", "学习", "居家"],
      "curiosityLevel": "适度好奇"
    },
    "dailyHabits": {
      "eating": ["规律三餐"],
      "shopping": "理性型",
      "caffeine": true
    }
  },
  
  "communication": {
    "speaking": {
      "volume": "话少",
      "pace": "深思熟虑",
      "responseTime": "忙完再回"
    },
    "conflictStyle": "冷静后谈",
    "relationshipPattern": {
      "idealFrequency": "不需要天天",
      "focusOn": "思想共鸣",
      "helpStyle": "提供建议"
    }
  },
  
  "personality": {
    "coreTraits": ["靠谱", "理性", "细心", "沉稳"],
    "strengthsAndWeaknesses": {
      "strengths": [
        "计划性强，说到做到，从不放鸽子",
        "分析能力好，能把复杂问题讲清楚",
        "情绪稳定，不会突然消失或冷战"
      ],
      "weaknesses": [
        "有点闷，不太会主动找话题",
        "回消息慢，经常忙完才看手机"
      ]
    }
  },
  
  "typicalBehaviors": {
    "morningRoutine": "7点的闹钟响起，会赖床5分钟。起来后先拉开窗帘，让阳光洒进来，然后慢慢冲杯咖啡，翻翻书或看看新闻，8点准时出门",
    "eveningRoutine": "晚上10点左右洗漱，会在床上刷一会手机，看看今天错过了什么。11点关灯，听着白噪音入睡",
    "weekendActivity": "周六早上去跑步，汗水带走一周的疲惫。下午窝在家里，泡杯茶看看书，或者学点感兴趣的新东西。晚上简单做顿饭，慢慢吃",
    "stressedMoment": "会去跑步或做运动，一个人出一身汗。不太找人倾诉，更喜欢让身体的疲惫冲淡心里的焦虑",
    "happyMoment": "会主动发消息分享，但不会大喊大叫。就是话比平时多，眼睛里有光，连打字都能感觉到那种雀跃"
  },
  
  "togetherScenes": {
    "dailyChat": "不会秒回，但回了就是认真想过的话。喜欢深夜用语音聊深度话题，白天用文字记录日常碎片",
    "whenYouSad": "不会着急问'怎么了'，会轻声说'我在，你想说就说'。然后就安静坐在你旁边，偶尔递个纸巾，像递一份无声的理解。等你准备好了，就听你慢慢说。或者约你出来，一起走走，让风吹散情绪",
    "whenYouHappy": "会认真听你分享每个细节，眼睛亮亮地看着你。偶尔吐槽一句，但语气是宠溺的，像是在说'看你傻乐的样子'",
    "weekendPlan": "周六一起去爬山或跑步，在运动里找到默契。然后找个安静的咖啡馆，坐一下午，聊聊最近的想法，或者就安静地各做各的事，偶尔抬头相视一笑"
  },
  
  "whyMatch": {
    "lifestyleMatch": "你们的作息像两只同步的时钟，都喜欢规律的生活，不会一个想睡一个想玩",
    "emotionalMatch": "你需要的安全感和稳定，在TA这里都能找到。就像一个可以随时停靠的港湾",
    "valueMatch": "你们都看重深度交流而非热闹社交，在一起时很安静，但心里很满足"
  },
  
  "uniqueDetails": {
    "catchphrase": "嗯，有道理，让我想想",
    "quirkyHabit": "有轻微强迫症，喜欢把东西摆得整整齐齐。书按高度排列，调料按颜色归类，看着就觉得心安",
    "favoriteTime": "清晨，阳光刚好，世界还很安静",
    "comfortFood": "一碗热汤面，冒着腾腾热气"
  }
}
\`\`\`

**重要提示：**
1. 所有描述必须具体、生活化，能想象出真实场景
2. 用温柔、有画面感的语言，但要基于具体行为和细节
3. 避免空洞的比喻，多用有质感的描述
4. 小缺点要真实可爱，不要太完美
5. 每个字段都要填写，不能用省略号或"待补充"
6. 中文输出，自然流畅，既文艺又接地气`;
}

/**
 * Parse professional personality JSON
 */
export function parseProfessionalPersonalityJSON(response: string): unknown {
  try {
    // Try direct parse
    return JSON.parse(response);
  } catch {
    // Try to extract JSON from markdown code block
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }

    // Try to find JSON object
    const objMatch = response.match(/\{[\s\S]*\}/);
    if (objMatch) {
      return JSON.parse(objMatch[0]);
    }

    throw new Error("无法从响应中提取 JSON");
  }
}

/**
 * Validate Big Five scores
 */
export function validateBigFiveScores(scores: any): boolean {
  const required = ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"];
  
  return required.every((key) => {
    const value = scores[key];
    return typeof value === "number" && value >= 1 && value <= 10;
  });
}

/**
 * Generate Big Five interpretation text
 */
export function interpretBigFive(scores: {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}): string {
  const interpretations: string[] = [];

  // Openness (开放性)
  if (scores.openness >= 7) {
    interpretations.push("喜欢尝试新事物，有创造力");
  } else if (scores.openness <= 4) {
    interpretations.push("更喜欢熟悉的事物，偏实际");
  }

  // Conscientiousness (尽责性)
  if (scores.conscientiousness >= 7) {
    interpretations.push("自律、有计划性、靠谱");
  } else if (scores.conscientiousness <= 4) {
    interpretations.push("随性、灵活、不太喜欢条条框框");
  }

  // Extraversion (外向性)
  if (scores.extraversion >= 7) {
    interpretations.push("外向、喜欢社交、精力充沛");
  } else if (scores.extraversion <= 4) {
    interpretations.push("内向、独处充电、深度交流");
  }

  // Agreeableness (宜人性)
  if (scores.agreeableness >= 7) {
    interpretations.push("善解人意、愿意妥协");
  } else if (scores.agreeableness <= 4) {
    interpretations.push("坚持己见、直接表达");
  }

  // Neuroticism (神经质 - 低分=情绪稳定)
  if (scores.neuroticism <= 4) {
    interpretations.push("情绪稳定、不容易焦虑");
  } else if (scores.neuroticism >= 7) {
    interpretations.push("情绪敏感、容易受影响");
  }

  return interpretations.join("；");
}

