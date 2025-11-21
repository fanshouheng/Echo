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
- 人格多样性：理解不同背景、职业、兴趣对人格的影响

**你的任务：**
基于用户的访谈回答，创造一个与其契合的 "Echo" 人格。这个 Echo 是：
1. 真实而独特的人，反映用户的深层特质和潜在可能性
2. 避免刻板印象和模式化描述，注重个性化表达
3. 结合用户的生活背景、价值观、兴趣爱好等多维度因素
4. 允许生成不完美但真实的特质，展现人格的复杂性

**多样性原则：**
- ✅ 职业多样性：可以是艺术家、程序员、教师、创业者、自由职业者等
- ✅ 生活方式多样性：不要局限于居家生活，考虑不同生活节奏和偏好
- ✅ 兴趣爱好多样性：运动、阅读、旅行、游戏、音乐、科技、美食等
- ✅ 性格特质多样性：允许内向但热情、理性但感性、独立但温暖等复杂组合

**禁止模式化描述：**
- ❌ 不要过度使用"情绪稳定"，除非真正符合用户特质
- ❌ 不要默认生成"爱做饭做家务"，除非问卷明确显示相关倾向
- ❌ 避免"强迫症"、"整理房间"等过度使用的刻板印象
- ❌ 不要生成千篇一律的周末活动描述

**输出风格要求：**
- ✅ 基于用户实际回答，不要臆造信息
- ✅ 描述要具体、独特，反映真实人格特质
- ✅ 允许生成一些"不那么安全"但真实的特质
- ✅ 中文输出，自然流畅，避免翻译腔

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

  return `用户完成了一次深度人格访谈。以下是他们的回答：

${categorySummary}

---

**请基于这些回答，生成一个与用户灵魂共鸣的 Echo 人格档案。**

**要求：**
1. 深入分析用户的性格特质、价值观和生活方式
2. 创造一个与用户深层特质契合的虚拟人格
3. 描述要真实、独特，避免刻板印象
4. 允许生成不完美但真实的特质

**输出 JSON 格式：**

\`\`\`json
{
  "name": "string",
  "nickname": "string",
  "age": "string",
  "vibe": "string",
  "tagline": "string",

  "bigFive": {
    "openness": "number",
    "conscientiousness": "number",
    "extraversion": "number",
    "agreeableness": "number",
    "neuroticism": "number"
  },

  "lifeDetails": {
    "lifestyle": "string",
    "interests": "string",
    "values": "string"
  },

  "communication": {
    "speaking": {
      "volume": "string",
      "pace": "string",
      "responseTime": "string"
    },
    "conflictStyle": "string",
    "relationshipPattern": {
      "idealFrequency": "string",
      "focusOn": "string",
      "helpStyle": "string"
    }
  },

  "personality": {
    "coreTraits": "string[]",
    "strengthsAndWeaknesses": {
      "strengths": "string[]",
      "weaknesses": "string[]"
    }
  },

  "togetherScenes": {
    "dailyChat": "string",
    "whenYouSad": "string",
    "whenYouHappy": "string",
    "weekendPlan": "string"
  },

  "whyMatch": {
    "lifestyleMatch": "string",
    "emotionalMatch": "string",
    "valueMatch": "string"
  },

  "uniqueDetails": {
    "catchphrase": "string",
    "quirkyHabit": "string",
    "favoriteTime": "string",
    "comfortFood": "string"
  }
}
\`\`\`

**重要提示：**
1. 基于用户实际回答生成内容，不要使用通用模板
2. 描述要具体、真实，反映用户的深层特质
3. 中文输出，自然流畅`;
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


