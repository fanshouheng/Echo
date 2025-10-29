/**
 * Professional Interview Questions
 * Based on Big Five personality model + Real-life scenarios
 * Focus on: practical details, behavior patterns, lifestyle
 */

import { InterviewQuestion } from "@/types/interview";

export const professionalQuestions: InterviewQuestion[] = [
  // === 生活作息与习惯 (Lifestyle & Routine) ===
  {
    id: "q001",
    text: "你的日常作息是？",
    description: "了解你的生物钟和生活节奏",
    inputType: "single-choice",
    options: [
      { id: "q001-a", label: "早睡早起（11点前睡，7点前起）", value: "early_bird" },
      { id: "q001-b", label: "晚睡晚起（1点后睡，9点后起）", value: "night_owl" },
      { id: "q001-c", label: "作息不固定，看情况", value: "flexible" },
      { id: "q001-d", label: "规律作息（固定时间睡醒）", value: "regular" },
    ],
    required: true,
    category: "lifestyle",
  },
  {
    id: "q002",
    text: "周末通常怎么度过？",
    description: "选择最符合你习惯的",
    inputType: "multiple-choice",
    options: [
      { id: "q002-a", label: "宅在家里休息、追剧、打游戏", value: "stay_home" },
      { id: "q002-b", label: "约朋友出去玩、聚餐", value: "social" },
      { id: "q002-c", label: "运动、健身、户外活动", value: "active" },
      { id: "q002-d", label: "学习、看书、提升自己", value: "self_improve" },
      { id: "q002-e", label: "做家务、整理房间", value: "organize" },
    ],
    required: true,
    category: "lifestyle",
  },
  {
    id: "q003",
    text: "房间通常是什么状态？",
    description: "诚实回答即可",
    inputType: "single-choice",
    options: [
      { id: "q003-a", label: "非常整洁，东西都归位", value: "very_tidy" },
      { id: "q003-b", label: "大体整洁，偶尔有点乱", value: "mostly_tidy" },
      { id: "q003-c", label: "有点乱，但知道东西在哪", value: "organized_chaos" },
      { id: "q003-d", label: "比较乱，经常找不到东西", value: "messy" },
    ],
    required: true,
    category: "lifestyle",
  },

  // === 社交模式 (Social Patterns - Extraversion) ===
  {
    id: "q004",
    text: "社交活动后的感受？",
    description: "参加聚会、社交场合后",
    inputType: "single-choice",
    options: [
      { id: "q004-a", label: "精力充沛，还想继续", value: "energized" },
      { id: "q004-b", label: "感觉还好，看情况", value: "neutral" },
      { id: "q004-c", label: "有点累，需要独处充电", value: "drained" },
      { id: "q004-d", label: "非常累，只想回家躺平", value: "exhausted" },
    ],
    required: true,
    category: "social",
  },
  {
    id: "q005",
    text: "朋友圈/社交媒体发布频率？",
    inputType: "single-choice",
    options: [
      { id: "q005-a", label: "经常发，分享日常（每天/隔天）", value: "frequent" },
      { id: "q005-b", label: "偶尔发，有事才发（每周）", value: "occasional" },
      { id: "q005-c", label: "很少发（每月或更少）", value: "rare" },
      { id: "q005-d", label: "基本不发，只看不发", value: "lurker" },
    ],
    required: true,
    category: "social",
  },
  {
    id: "q006",
    text: "遇到问题时的第一反应？",
    inputType: "single-choice",
    options: [
      { id: "q006-a", label: "找朋友聊聊，寻求建议", value: "seek_support" },
      { id: "q006-b", label: "自己先想想，实在不行再找人", value: "think_first" },
      { id: "q006-c", label: "倾向于自己解决", value: "independent" },
      { id: "q006-d", label: "上网搜索、查资料", value: "research" },
    ],
    required: true,
    category: "social",
  },

  // === 决策与计划 (Decision-making - Conscientiousness) ===
  {
    id: "q007",
    text: "做计划/决定时的风格？",
    inputType: "single-choice",
    options: [
      { id: "q007-a", label: "提前详细规划，列清单", value: "planner" },
      { id: "q007-b", label: "大致规划，保留弹性", value: "flexible_planner" },
      { id: "q007-c", label: "很少规划，走一步看一步", value: "spontaneous" },
      { id: "q007-d", label: "完全随心，临时决定", value: "impulsive" },
    ],
    required: true,
    category: "decision",
  },
  {
    id: "q008",
    text: "如何处理待办事项？",
    inputType: "single-choice",
    options: [
      { id: "q008-a", label: "马上做，不拖延", value: "immediate" },
      { id: "q008-b", label: "按优先级，一件件完成", value: "prioritize" },
      { id: "q008-c", label: "ddl 前集中处理", value: "deadline_driven" },
      { id: "q008-d", label: "经常拖延，最后赶工", value: "procrastinator" },
    ],
    required: true,
    category: "decision",
  },
  {
    id: "q009",
    text: "旅行/外出前的准备？",
    inputType: "single-choice",
    options: [
      { id: "q009-a", label: "提前做攻略，订好行程", value: "well_prepared" },
      { id: "q009-b", label: "查基本信息，到了再说", value: "basic_prep" },
      { id: "q009-c", label: "临时决定，随机应变", value: "spontaneous" },
      { id: "q009-d", label: "跟着别人走，不操心", value: "follower" },
    ],
    required: true,
    category: "decision",
  },

  // === 情绪与压力 (Emotions - Neuroticism) ===
  {
    id: "q010",
    text: "遇到突发状况时？",
    description: "比如计划被打乱、出现意外",
    inputType: "single-choice",
    options: [
      { id: "q010-a", label: "冷静应对，快速调整", value: "calm" },
      { id: "q010-b", label: "有点慌，但能处理", value: "slightly_anxious" },
      { id: "q010-c", label: "比较焦虑，需要时间缓解", value: "anxious" },
      { id: "q010-d", label: "容易崩溃，情绪波动大", value: "very_anxious" },
    ],
    required: true,
    category: "emotion",
  },
  {
    id: "q011",
    text: "情绪不好时如何调节？",
    description: "可多选",
    inputType: "multiple-choice",
    options: [
      { id: "q011-a", label: "运动、散步、出去走走", value: "exercise" },
      { id: "q011-b", label: "找朋友倾诉", value: "talk" },
      { id: "q011-c", label: "睡觉、休息", value: "sleep" },
      { id: "q011-d", label: "看剧、打游戏、听音乐", value: "entertainment" },
      { id: "q011-e", label: "写日记、独处思考", value: "reflect" },
      { id: "q011-f", label: "吃东西、购物", value: "indulge" },
    ],
    required: true,
    category: "emotion",
  },
  {
    id: "q012",
    text: "被批评/否定时的反应？",
    inputType: "single-choice",
    options: [
      { id: "q012-a", label: "虚心接受，反思改进", value: "accept" },
      { id: "q012-b", label: "看情况，有道理就改", value: "selective" },
      { id: "q012-c", label: "表面接受，内心不服", value: "defensive" },
      { id: "q012-d", label: "很难接受，容易受伤", value: "sensitive" },
    ],
    required: true,
    category: "emotion",
  },

  // === 开放性与好奇心 (Openness) ===
  {
    id: "q013",
    text: "对新事物的态度？",
    description: "新餐厅、新活动、新技术等",
    inputType: "single-choice",
    options: [
      { id: "q013-a", label: "非常愿意尝试，追求新鲜感", value: "adventurous" },
      { id: "q013-b", label: "感兴趣会尝试", value: "open" },
      { id: "q013-c", label: "比较谨慎，需要了解再尝试", value: "cautious" },
      { id: "q013-d", label: "更喜欢熟悉的东西", value: "traditional" },
    ],
    required: true,
    category: "openness",
  },
  {
    id: "q014",
    text: "兴趣爱好的类型？",
    description: "可多选",
    inputType: "multiple-choice",
    options: [
      { id: "q014-a", label: "运动类（跑步、健身、球类）", value: "sports" },
      { id: "q014-b", label: "文艺类（音乐、绘画、写作）", value: "arts" },
      { id: "q014-c", label: "学习类（语言、技能、知识）", value: "learning" },
      { id: "q014-d", label: "娱乐类（游戏、追剧、刷视频）", value: "entertainment" },
      { id: "q014-e", label: "社交类（聚会、聊天、结交新朋友）", value: "social" },
      { id: "q014-f", label: "居家类（烹饪、手工、养植物）", value: "domestic" },
    ],
    required: true,
    category: "openness",
  },

  // === 沟通风格 (Communication) ===
  {
    id: "q015",
    text: "日常沟通中的风格？",
    inputType: "single-choice",
    options: [
      { id: "q015-a", label: "话多，喜欢分享各种事", value: "talkative" },
      { id: "q015-b", label: "适度，有话题就聊", value: "moderate" },
      { id: "q015-c", label: "话少，更喜欢听", value: "listener" },
      { id: "q015-d", label: "看对象和心情", value: "situational" },
    ],
    required: true,
    category: "communication",
  },
  {
    id: "q016",
    text: "消息回复习惯？",
    inputType: "single-choice",
    options: [
      { id: "q016-a", label: "秒回，看到就回", value: "instant" },
      { id: "q016-b", label: "尽快回，但不一定秒回", value: "quick" },
      { id: "q016-c", label: "忙完了再集中回复", value: "delayed" },
      { id: "q016-d", label: "经常忘记回，或者懒得回", value: "forgetful" },
    ],
    required: true,
    category: "communication",
  },
  {
    id: "q017",
    text: "发生冲突/分歧时？",
    inputType: "single-choice",
    options: [
      { id: "q017-a", label: "直接说出来，当场解决", value: "direct" },
      { id: "q017-b", label: "冷静思考后，找时机沟通", value: "thoughtful" },
      { id: "q017-c", label: "倾向于妥协，避免冲突", value: "accommodating" },
      { id: "q017-d", label: "冷战，不想谈", value: "avoidant" },
    ],
    required: true,
    category: "communication",
  },

  // === 价值观与关系 (Values & Relationships) ===
  {
    id: "q018",
    text: "在关系中更看重？",
    inputType: "single-choice",
    options: [
      { id: "q018-a", label: "共同成长，相互激励", value: "growth" },
      { id: "q018-b", label: "情感支持，相互陪伴", value: "support" },
      { id: "q018-c", label: "思想共鸣，深度交流", value: "intellectual" },
      { id: "q018-d", label: "生活契合，舒适自在", value: "compatibility" },
    ],
    required: true,
    category: "values",
  },
  {
    id: "q019",
    text: "理想的相处模式？",
    inputType: "single-choice",
    options: [
      { id: "q019-a", label: "经常联系，分享日常", value: "frequent_contact" },
      { id: "q019-b", label: "保持联系，但各有空间", value: "balanced" },
      { id: "q019-c", label: "不需要天天联系，有事再说", value: "independent" },
      { id: "q019-d", label: "深度交流，不在于频率", value: "quality_over_quantity" },
    ],
    required: true,
    category: "values",
  },
  {
    id: "q020",
    text: "对方需要帮忙时？",
    description: "比如对方遇到困难、需要支持",
    inputType: "single-choice",
    options: [
      { id: "q020-a", label: "立刻行动，尽力帮忙", value: "immediate_help" },
      { id: "q020-b", label: "提供建议和分析", value: "advice" },
      { id: "q020-c", label: "情感支持和陪伴", value: "emotional_support" },
      { id: "q020-d", label: "给予空间，让TA自己解决", value: "space" },
    ],
    required: true,
    category: "values",
  },

  // === 生活细节 (Life Details) ===
  {
    id: "q021",
    text: "饮食习惯？",
    inputType: "multiple-choice",
    options: [
      { id: "q021-a", label: "规律三餐", value: "regular_meals" },
      { id: "q021-b", label: "经常不吃早餐", value: "skip_breakfast" },
      { id: "q021-c", label: "喜欢夜宵/零食", value: "snacker" },
      { id: "q021-d", label: "爱吃甜食", value: "sweet_tooth" },
      { id: "q021-e", label: "喜欢喝咖啡/茶", value: "caffeine" },
      { id: "q021-f", label: "饮食随意，不讲究", value: "casual_eater" },
    ],
    required: true,
    category: "lifestyle",
  },
  {
    id: "q022",
    text: "购物习惯？",
    inputType: "single-choice",
    options: [
      { id: "q022-a", label: "冲动型，看到喜欢就买", value: "impulsive" },
      { id: "q022-b", label: "理性型，货比三家", value: "rational" },
      { id: "q022-c", label: "极简型，只买必需品", value: "minimalist" },
      { id: "q022-d", label: "囤货型，喜欢备很多", value: "stockpiler" },
    ],
    required: true,
    category: "lifestyle",
  },

  // === 开放式问题 (Open-ended) ===
  {
    id: "q023",
    text: "描述一个你理想的周末",
    description: "从早到晚，你想怎么度过？（50字以内）",
    inputType: "text",
    placeholder: "例如：9点自然醒，做早餐，看会书，下午约朋友喝咖啡，晚上在家追剧...",
    required: true,
    category: "lifestyle",
  },
  {
    id: "q024",
    text: "最近让你开心的一件小事",
    description: "生活中的小确幸（30字以内）",
    inputType: "text",
    placeholder: "例如：下班路上遇到超美的晚霞；买到了心仪的东西；朋友的一句暖心话...",
    required: true,
    category: "emotion",
  },
  {
    id: "q025",
    text: "用3个词描述理想中的TA",
    description: "可以是性格、特质、给你的感觉",
    inputType: "text",
    placeholder: "例如：温柔、有趣、靠谱",
    required: true,
    category: "values",
  },
];

/**
 * Question categories with descriptions
 */
export const questionCategories = {
  lifestyle: "生活方式与习惯",
  social: "社交模式",
  decision: "决策与计划",
  emotion: "情绪与压力",
  openness: "开放性与好奇心",
  communication: "沟通风格",
  values: "价值观与关系",
};

export function getQuestionById(id: string): InterviewQuestion | undefined {
  return professionalQuestions.find((q) => q.id === id);
}

export function getQuestionsByCategory(
  category: InterviewQuestion["category"]
): InterviewQuestion[] {
  return professionalQuestions.filter((q) => q.category === category);
}

export function getTotalQuestionCount(): number {
  return professionalQuestions.length;
}

