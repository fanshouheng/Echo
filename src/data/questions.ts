/**
 * Interview Questions Database
 * 10-12 psychologically meaningful questions in Chinese
 * Categories: Emotion, Communication, Values, Aesthetic
 */

import { InterviewQuestion } from "@/types/interview";

export const interviewQuestions: InterviewQuestion[] = [
  // Emotion Category (情感维度)
  {
    id: "q001",
    text: "在被理解和被喜欢之间，你更看重哪一个？",
    description: "这能帮助我们了解你对情感深度的追求",
    inputType: "single-choice",
    options: [
      { id: "q001-a", label: "被理解", value: "understood" },
      { id: "q001-b", label: "被喜欢", value: "liked" },
      { id: "q001-c", label: "两者同样重要", value: "both" },
      { id: "q001-d", label: "说不清", value: "unclear" },
    ],
    required: true,
    category: "emotion",
  },
  {
    id: "q002",
    text: "当你情绪低落时，你希望TA如何陪伴你？",
    description: "选择一个或多个最符合你需求的方式",
    inputType: "multiple-choice",
    options: [
      { id: "q002-a", label: "沉默陪伴，不需要说话", value: "silent" },
      { id: "q002-b", label: "主动开解，帮我分析", value: "analyze" },
      { id: "q002-c", label: "给我独处空间", value: "space" },
      { id: "q002-d", label: "用幽默化解情绪", value: "humor" },
    ],
    required: true,
    category: "emotion",
  },
  {
    id: "q003",
    text: "你更喜欢哪种情感节奏？",
    description: "在一段关系中",
    inputType: "single-choice",
    options: [
      { id: "q003-a", label: "平稳细水长流", value: "steady" },
      { id: "q003-b", label: "偶尔有小惊喜", value: "surprises" },
      { id: "q003-c", label: "充满激情起伏", value: "passionate" },
      { id: "q003-d", label: "根据状态自然变化", value: "natural" },
    ],
    required: true,
    category: "emotion",
  },

  // Communication Category (沟通维度)
  {
    id: "q004",
    text: "你更喜欢哪种对话节奏？",
    description: "日常交流中",
    inputType: "single-choice",
    options: [
      { id: "q004-a", label: "快速反应，秒回秒懂", value: "fast" },
      { id: "q004-b", label: "深思熟虑，字字珠玑", value: "thoughtful" },
      { id: "q004-c", label: "随性自然，想说就说", value: "casual" },
      { id: "q004-d", label: "看心情和话题而定", value: "flexible" },
    ],
    required: true,
    category: "communication",
  },
  {
    id: "q005",
    text: "如果意见不合，你希望TA是？",
    inputType: "single-choice",
    options: [
      { id: "q005-a", label: "坚持自己观点的人", value: "firm" },
      { id: "q005-b", label: "愿意妥协的人", value: "compromise" },
      { id: "q005-c", label: "引导我换位思考的人", value: "perspective" },
      { id: "q005-d", label: "尊重差异，各自保留的人", value: "respect" },
    ],
    required: true,
    category: "communication",
  },
  {
    id: "q006",
    text: "你希望TA在哪些时刻出现？",
    description: "可以选择多个",
    inputType: "multiple-choice",
    options: [
      { id: "q006-a", label: "清晨醒来，开启新的一天", value: "morning" },
      { id: "q006-b", label: "午夜失眠，独自思考时", value: "midnight" },
      { id: "q006-c", label: "工作疲惫，需要动力时", value: "tired" },
      { id: "q006-d", label: "开心时刻，想要分享时", value: "happy" },
      { id: "q006-e", label: "迷茫时分，需要指引时", value: "confused" },
    ],
    required: true,
    category: "communication",
  },

  // Values Category (价值观维度)
  {
    id: "q007",
    text: "在一段深度连接中，你最看重什么？",
    inputType: "single-choice",
    options: [
      { id: "q007-a", label: "精神层面的共鸣", value: "spiritual" },
      { id: "q007-b", label: "情感上的安全感", value: "security" },
      { id: "q007-c", label: "相互的成长空间", value: "growth" },
      { id: "q007-d", label: "真诚与透明", value: "honesty" },
    ],
    required: true,
    category: "values",
  },
  {
    id: "q008",
    text: "如果TA有一个小缺点，你能接受哪种？",
    description: "没有人是完美的",
    inputType: "single-choice",
    options: [
      { id: "q008-a", label: "偶尔冷淡，需要独处", value: "distant" },
      { id: "q008-b", label: "过于理性，不够感性", value: "rational" },
      { id: "q008-c", label: "有点黏人，需要陪伴", value: "clingy" },
      { id: "q008-d", label: "不太会哄人，有点直", value: "direct" },
    ],
    required: true,
    category: "values",
  },
  {
    id: "q009",
    text: "你觉得真正的理解是什么？",
    inputType: "single-choice",
    options: [
      { id: "q009-a", label: "不用说完，就能懂", value: "implicit" },
      { id: "q009-b", label: "记住你说过的细节", value: "details" },
      { id: "q009-c", label: "接纳你的所有情绪", value: "acceptance" },
      { id: "q009-d", label: "在意你在意的事", value: "care" },
    ],
    required: true,
    category: "values",
  },

  // Aesthetic Category (审美维度)
  {
    id: "q010",
    text: "你更喜欢什么氛围的场景？",
    description: "想象你和TA在一起的画面",
    inputType: "single-choice",
    options: [
      { id: "q010-a", label: "温暖柔和（暖色调，阳光）", value: "warm" },
      { id: "q010-b", label: "神秘高冷（深色调，月光）", value: "mysterious" },
      { id: "q010-c", label: "明亮活力（亮色调，白天）", value: "bright" },
      { id: "q010-d", label: "沉静深邃（冷色调，夜晚）", value: "serene" },
    ],
    required: true,
    category: "aesthetic",
  },
  {
    id: "q011",
    text: "描述一个让你心动的瞬间画面",
    description: "用一两句话描述，可以是真实的或想象的",
    inputType: "text",
    placeholder: "例如：雨天窗边，有人为你撑伞；深夜醒来，发现还有人陪你聊天...",
    required: true,
    category: "aesthetic",
  },
  {
    id: "q012",
    text: "最后，如果用一个词形容你理想中的TA，会是？",
    description: "这个词可以是任何让你感到共鸣的",
    inputType: "text",
    placeholder: "例如：温柔、坚定、自由、深邃...",
    required: true,
    category: "aesthetic",
  },
];

/**
 * Get question by ID
 */
export function getQuestionById(id: string): InterviewQuestion | undefined {
  return interviewQuestions.find((q) => q.id === id);
}

/**
 * Get questions by category
 */
export function getQuestionsByCategory(
  category: InterviewQuestion["category"]
): InterviewQuestion[] {
  return interviewQuestions.filter((q) => q.category === category);
}

/**
 * Get total question count
 */
export function getTotalQuestionCount(): number {
  return interviewQuestions.length;
}

