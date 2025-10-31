/**
 * Partner Matching Questions (Revised)
 * Focus: Understand user's own personality, emotional patterns, and lifestyle
 * AI will infer ideal partner traits based on user's characteristics
 * 
 * Strategy: Ask about USER, not about ideal partner
 * - User's attachment patterns → Infer compatible partner
 * - User's emotional needs → Infer partner's support style
 * - User's communication style → Infer partner's communication style
 * - User's lifestyle → Infer compatible lifestyle
 */

import { InterviewQuestion } from "@/types/interview";

export const partnerMatchingQuestions: InterviewQuestion[] = [
  // === 用户自身的依恋模式 (User's Own Attachment Patterns) ===
  {
    id: "p001",
    text: "当你陷入一段关系时，你通常会？",
    description: "选择最符合你实际情况的",
    inputType: "single-choice",
    options: [
      { id: "p001-a", label: "容易担心对方不够爱我，需要经常确认", value: "user_anxious_pattern" },
      { id: "p001-b", label: "比较独立，不喜欢过度依赖或被依赖", value: "user_avoidant_pattern" },
      { id: "p001-c", label: "既能独立又能亲密，关系中比较安全", value: "user_secure_pattern" },
      { id: "p001-d", label: "时而渴望亲密时而害怕受伤，矛盾复杂", value: "user_disorganized_pattern" },
    ],
    required: true,
    category: "attachment",
  },
  {
    id: "p002", 
    text: "当重要的人很久不联系你时，你的第一反应是？",
    inputType: "single-choice",
    options: [
      { id: "p002-a", label: "担心是不是我做错了什么，主动联系确认", value: "user_anxious_response" },
      { id: "p002-b", label: "觉得正常，各自忙各自的事情", value: "user_avoidant_response" },
      { id: "p002-c", label: "会想念但不会过度担心，相信对方", value: "user_secure_response" },
      { id: "p002-d", label: "既想联系又怕打扰，纠结不安", value: "user_ambivalent_response" },
    ],
    required: true,
    category: "attachment",
  },

  // === 用户的情感模式 (User's Emotional Patterns) ===
  {
    id: "p003",
    text: "当你情绪低落时，你通常？",
    description: "选择你最常有的反应",
    inputType: "single-choice", 
    options: [
      { id: "p003-a", label: "希望有人主动关心，帮我解决问题", value: "user_needs_active_help" },
      { id: "p003-b", label: "希望有人静静陪伴，不问原因", value: "user_needs_silent_support" },
      { id: "p003-c", label: "希望独处，自己调节情绪", value: "user_needs_space" },
      { id: "p003-d", label: "希望有人逗我开心，转移注意力", value: "user_needs_distraction" },
      { id: "p003-e", label: "希望有身体接触，拥抱或安慰", value: "user_needs_physical_comfort" },
    ],
    required: true,
    category: "emotional_needs",
  },
  {
    id: "p004",
    text: "你平时如何表达关心和爱意？",
    inputType: "single-choice",
    options: [
      { id: "p004-a", label: "用言语表达：夸奖、鼓励、说甜言蜜语", value: "user_expresses_words" },
      { id: "p004-b", label: "花时间陪伴：专心陪伴、深度交流", value: "user_expresses_time" },
      { id: "p004-c", label: "身体接触：拥抱、牵手、亲密接触", value: "user_expresses_touch" },
      { id: "p004-d", label: "服务行动：为对方做事、照顾需要", value: "user_expresses_service" },
      { id: "p004-e", label: "礼物馈赠：用心的礼物、惊喜", value: "user_expresses_gifts" },
    ],
    required: true,
    category: "emotional_needs",
  },

  // === 用户的沟通风格 (User's Communication Style) ===
  {
    id: "p005",
    text: "你的沟通风格更偏向？",
    inputType: "single-choice",
    options: [
      { id: "p005-a", label: "直接坦诚，有话直说，不绕弯子", value: "user_direct_communication" },
      { id: "p005-b", label: "温和委婉，照顾彼此感受", value: "user_gentle_communication" },
      { id: "p005-c", label: "深度交流，喜欢聊内心想法", value: "user_deep_communication" },
      { id: "p005-d", label: "轻松幽默，不喜欢太严肃", value: "user_humorous_communication" },
    ],
    required: true,
    category: "communication",
  },
  {
    id: "p006",
    text: "发生争吵或分歧时，你通常会？",
    inputType: "single-choice",
    options: [
      { id: "p006-a", label: "立即沟通解决，不过夜", value: "user_immediate_resolution" },
      { id: "p006-b", label: "先冷静一下，过后再谈", value: "user_cooling_off" },
      { id: "p006-c", label: "希望对方主动道歉，哄我开心", value: "user_wants_apology" },
      { id: "p006-d", label: "理性分析，找出问题根源", value: "user_analytical_approach" },
      { id: "p006-e", label: "适当妥协，维护关系和谐", value: "user_compromising_approach" },
    ],
    required: true,
    category: "communication",
  },

  // === 用户的性格特征 (User's Personality Traits) ===
  {
    id: "p007",
    text: "你觉得自己在性格上的特点是？",
    description: "选择最符合你的，可以多选",
    inputType: "multiple-choice",
    options: [
      { id: "p007-a", label: "比较内向，不太喜欢社交", value: "user_introverted" },
      { id: "p007-b", label: "容易焦虑，情绪波动较大", value: "user_anxious" },
      { id: "p007-c", label: "不够果断，经常犹豫不决", value: "user_indecisive" },
      { id: "p007-d", label: "比较理性，不太感性浪漫", value: "user_rational" },
      { id: "p007-e", label: "缺乏计划性，比较随性", value: "user_spontaneous" },
      { id: "p007-f", label: "不够幽默，比较严肃", value: "user_serious" },
      { id: "p007-g", label: "比较外向，喜欢社交", value: "user_extroverted" },
      { id: "p007-h", label: "情绪稳定，很少大起大落", value: "user_stable" },
      { id: "p007-i", label: "比较果断，能快速做决定", value: "user_decisive" },
      { id: "p007-j", label: "比较感性，注重浪漫", value: "user_romantic" },
      { id: "p007-k", label: "很有计划性，喜欢规划", value: "user_planned" },
      { id: "p007-l", label: "很幽默，能逗人开心", value: "user_humorous" },
    ],
    required: true,
    category: "personality",
  },

  // === 用户的生活方式 (User's Lifestyle) ===
  {
    id: "p008",
    text: "你的日常作息是？",
    inputType: "single-choice",
    options: [
      { id: "p008-a", label: "早睡早起，作息规律", value: "user_early_bird" },
      { id: "p008-b", label: "晚睡晚起，夜猫子", value: "user_night_owl" },
      { id: "p008-c", label: "作息不固定，看情况", value: "user_flexible_schedule" },
      { id: "p008-d", label: "固定作息，但时间点因人而异", value: "user_regular_schedule" },
    ],
    required: true,
    category: "lifestyle",
  },
  {
    id: "p009",
    text: "周末通常怎么度过？",
    inputType: "multiple-choice",
    options: [
      { id: "p009-a", label: "宅在家里休息、追剧、打游戏", value: "user_stay_home" },
      { id: "p009-b", label: "约朋友出去玩、聚餐", value: "user_social" },
      { id: "p009-c", label: "运动、健身、户外活动", value: "user_active" },
      { id: "p009-d", label: "学习、看书、提升自己", value: "user_self_improve" },
      { id: "p009-e", label: "做家务、整理房间", value: "user_organize" },
      { id: "p009-f", label: "什么都不做，完全放松", value: "user_relax" },
    ],
    required: true,
    category: "lifestyle",
  },
  {
    id: "p010",
    text: "你的房间通常是什么状态？",
    inputType: "single-choice",
    options: [
      { id: "p010-a", label: "非常整洁，东西都归位", value: "user_very_tidy" },
      { id: "p010-b", label: "大体整洁，偶尔有点乱", value: "user_mostly_tidy" },
      { id: "p010-c", label: "有点乱，但知道东西在哪", value: "user_organized_chaos" },
      { id: "p010-d", label: "比较乱，经常找不到东西", value: "user_messy" },
    ],
    required: true,
    category: "lifestyle",
  },

  // === 用户的价值观 (User's Values) ===
  {
    id: "p011",
    text: "你对未来生活的期待是？",
    inputType: "single-choice",
    options: [
      { id: "p011-a", label: "有明确的规划，一步步实现目标", value: "user_planned_future" },
      { id: "p011-b", label: "顺其自然，享受当下", value: "user_go_with_flow" },
      { id: "p011-c", label: "有大致方向，但保持灵活性", value: "user_flexible_planning" },
      { id: "p011-d", label: "不断探索，不设限", value: "user_exploratory" },
    ],
    required: true,
    category: "values",
  },
  {
    id: "p012",
    text: "你更看重关系中的什么？",
    inputType: "multiple-choice",
    options: [
      { id: "p012-a", label: "安全感，内心的平静", value: "user_values_security" },
      { id: "p012-b", label: "个人成长，变成更好的自己", value: "user_values_growth" },
      { id: "p012-c", label: "生活乐趣，更多快乐体验", value: "user_values_enjoyment" },
      { id: "p012-d", label: "深度连接，灵魂层面的理解", value: "user_values_connection" },
      { id: "p012-e", label: "稳定陪伴，不孤单的感觉", value: "user_values_companionship" },
      { id: "p012-f", label: "新的视角，拓展我的世界", value: "user_values_perspective" },
    ],
    required: true,
    category: "values",
  },

  // === 用户的社交模式 (User's Social Patterns) ===
  {
    id: "p013",
    text: "你在社交场合的表现是？",
    inputType: "single-choice",
    options: [
      { id: "p013-a", label: "很活跃，主动聊天，不冷场", value: "user_social_active" },
      { id: "p013-b", label: "适度参与，不会太突出", value: "user_social_moderate" },
      { id: "p013-c", label: "比较安静，更多是观察和倾听", value: "user_social_quiet" },
      { id: "p013-d", label: "看心情，有时活跃有时安静", value: "user_social_variable" },
    ],
    required: true,
    category: "social",
  },
  {
    id: "p014",
    text: "你更喜欢哪种相处方式？",
    inputType: "single-choice",
    options: [
      { id: "p014-a", label: "大部分时间在一起，分享所有日常", value: "user_high_togetherness" },
      { id: "p014-b", label: "一半时间在一起，一半各自空间", value: "user_balanced_time" },
      { id: "p014-c", label: "重要时刻在一起，平时各忙各的", value: "user_quality_over_quantity" },
      { id: "p014-d", label: "保持独立，偶尔深度相聚", value: "user_independent_connection" },
    ],
    required: true,
    category: "social",
  },

  // === 用户的决策风格 (User's Decision Style) ===
  {
    id: "p015",
    text: "做重要决定时，你通常会？",
    inputType: "single-choice",
    options: [
      { id: "p015-a", label: "自己思考，快速决定", value: "user_quick_decider" },
      { id: "p015-b", label: "咨询他人意见，综合判断", value: "user_consults_others" },
      { id: "p015-c", label: "反复思考，需要较长时间", value: "user_thinks_long" },
      { id: "p015-d", label: "跟着感觉走，直觉判断", value: "user_intuitive" },
    ],
    required: true,
    category: "decision",
  },

  // === 用户的压力应对 (User's Stress Response) ===
  {
    id: "p016",
    text: "当你压力很大时，你通常会？",
    inputType: "single-choice",
    options: [
      { id: "p016-a", label: "找人倾诉，寻求建议和帮助", value: "user_seeks_help" },
      { id: "p016-b", label: "一个人消化，自己想办法", value: "user_solo_process" },
      { id: "p016-c", label: "转移注意力，做其他事情", value: "user_distracts" },
      { id: "p016-d", label: "暂时逃避，等情绪平复", value: "user_avoids" },
    ],
    required: true,
    category: "stress",
  },

  // === 开放式问题 (Open-ended Questions) ===
  {
    id: "p017",
    text: "描述一个让你感到被理解或被爱的瞬间",
    description: "可以是想象的或真实经历过的（50字以内）",
    inputType: "text",
    placeholder: "例如：下雨天有人主动来接我，什么都没说，只是递给我一杯热奶茶...",
    required: true,
    category: "emotional_needs",
  },
  {
    id: "p018",
    text: "你最害怕在关系中遇到什么？",
    description: "诚实表达你的担忧（30字以内）",
    inputType: "text", 
    placeholder: "例如：被忽视、不被理解、失去自由、被背叛...",
    required: true,
    category: "fears",
  },
  {
    id: "p019",
    text: "你觉得什么能让你在关系中感到安全？",
    description: "描述能让你感到安心和信任的因素（30字以内）",
    inputType: "text",
    placeholder: "例如：对方主动联系、记得我说过的话、给我足够的空间...",
    required: true,
    category: "security",
  },
  {
    id: "p020",
    text: "你理想中的周末下午是什么样的？",
    description: "描述一个让你感到舒适的周末下午场景（40字以内）",
    inputType: "text",
    placeholder: "例如：在家看书，窗外下着小雨，有热茶，有人在旁边安静地做自己的事...",
    required: true,
    category: "lifestyle",
  },
];

/**
 * Question categories for partner matching
 */
export const partnerQuestionCategories = {
  attachment: "依恋模式",
  emotional_needs: "情感模式", 
  communication: "沟通风格",
  personality: "性格特征",
  lifestyle: "生活方式",
  values: "价值观念",
  social: "社交模式",
  decision: "决策风格",
  stress: "压力应对",
  fears: "关系担忧",
  security: "安全感",
};

export function getPartnerQuestionById(id: string): InterviewQuestion | undefined {
  return partnerMatchingQuestions.find((q) => q.id === id);
}

export function getPartnerQuestionsByCategory(
  category: InterviewQuestion["category"]
): InterviewQuestion[] {
  return partnerMatchingQuestions.filter((q) => q.category === category);
}

export function getPartnerQuestionCount(): number {
  return partnerMatchingQuestions.length;
}
