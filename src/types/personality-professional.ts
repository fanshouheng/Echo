/**
 * Professional Personality Type Definitions
 * Based on Big Five + Real-life details
 * Focus: practical, behavioral, grounded in reality
 */

/**
 * Big Five personality scores (1-10 scale)
 */
export interface BigFiveScores {
  openness: number; // 开放性：创造力、好奇心
  conscientiousness: number; // 尽责性：自律、计划性
  extraversion: number; // 外向性：社交、活力
  agreeableness: number; // 宜人性：同理心、合作
  neuroticism: number; // 神经质：情绪稳定性（低分=稳定）
}

/**
 * Life details and habits
 */
export interface LifeDetails {
  // 作息与生活习惯
  routine: {
    sleepPattern: string; // "早睡早起" | "晚睡晚起" | "不固定"
    weekendStyle: string[]; // ["宅家", "社交", "运动", "学习"]
    roomTidiness: string; // "非常整洁" | "大体整洁" | "有点乱"
  };

  // 社交模式
  social: {
    energySource: string; // "社交充电" | "独处充电" | "看情况"
    socialMediaStyle: string; // "经常发" | "偶尔发" | "很少发"
    problemSolvingStyle: string; // "找朋友" | "自己解决" | "先想后问"
    friendCircleSize: string; // "朋友很多" | "朋友不多但很深" | "独来独往"
  };

  // 决策与计划
  decision: {
    planningStyle: string; // "详细规划" | "大致规划" | "随心而动"
    taskHandling: string; // "马上做" | "按优先级" | "ddl驱动" | "拖延症"
    travelPrep: string; // "提前攻略" | "基本准备" | "随机应变"
  };

  // 情绪管理
  emotion: {
    stressResponse: string; // "冷静应对" | "有点慌" | "比较焦虑"
    copingMethods: string[]; // ["运动", "倾诉", "睡觉", "娱乐"]
    criticismReaction: string; // "虚心接受" | "选择性接受" | "容易受伤"
  };

  // 兴趣与开放性
  interests: {
    attitudeToNew: string; // "非常愿意尝试" | "感兴趣会试" | "喜欢熟悉的"
    hobbyTypes: string[]; // ["运动", "文艺", "学习", "娱乐", "社交"]
    curiosityLevel: string; // "强烈好奇" | "适度好奇" | "不太好奇"
  };

  // 日常小习惯
  dailyHabits: {
    eating: string[]; // ["规律三餐", "不吃早餐", "爱吃零食"]
    shopping: string; // "冲动型" | "理性型" | "极简型"
    caffeine: boolean; // 是否喝咖啡/茶
    petPreference?: string; // "喜欢猫" | "喜欢狗" | "不养宠物"
  };
}

/**
 * Communication and relationship style
 */
export interface CommunicationStyle {
  // 沟通特点
  speaking: {
    volume: string; // "话多" | "适度" | "话少"
    pace: string; // "快速反应" | "深思熟虑" | "随性自然"
    responseTime: string; // "秒回" | "尽快回" | "忙完再回" | "经常忘记"
  };

  // 冲突处理
  conflictStyle: string; // "直接沟通" | "冷静后谈" | "倾向妥协" | "冷战回避"

  // 相处模式
  relationshipPattern: {
    idealFrequency: string; // "经常联系" | "保持联系" | "不需要天天"
    focusOn: string; // "共同成长" | "情感支持" | "思想共鸣" | "生活契合"
    helpStyle: string; // "立刻行动" | "提供建议" | "情感支持" | "给予空间"
  };
}

/**
 * Professional personality profile
 */
export interface ProfessionalPersonalityProfile {
  // === 基本信息 ===
  name: string; // 名字（2-3字，接地气）
  nickname?: string; // 昵称/称呼（可选）
  age: string; // 年龄感："20出头" | "25-30" | "30+"
  vibe: string; // 整体氛围："温暖邻家" | "冷静理性" | "活力开朗" | "沉稳可靠"

  // === 一句话介绍 ===
  tagline: string; // 20字以内，实际不文艺

  // === 人格维度（Big Five分数）===
  bigFive: BigFiveScores;

  // === 生活细节 ===
  lifeDetails: LifeDetails;

  // === 沟通风格 ===
  communication: CommunicationStyle;

  // === 性格描述（简洁实际）===
  personality: {
    coreTraits: string[]; // 3-5个核心性格词："靠谱"、"有趣"、"细心"
    strengthsAndWeaknesses: {
      strengths: string[]; // 2-3个优点，具体行为化
      weaknesses: string[]; // 1-2个小缺点，真实接地气
    };
  };

  // === 典型行为场景（具体！）===
  typicalBehaviors: {
    morningRoutine: string; // 早上怎么开始一天（30字）
    eveningRoutine: string; // 晚上怎么结束一天（30字）
    weekendActivity: string; // 典型的周末活动（30字）
    stressedMoment: string; // 压力大时会做什么（30字）
    happyMoment: string; // 开心时的表现（30字）
  };

  // === 相处画面（生活化场景）===
  togetherScenes: {
    dailyChat: string; // 日常聊天时的样子（40字）
    whenYouSad: string; // 你难过时TA会怎么做（40字）
    whenYouHappy: string; // 你开心时TA会怎么做（40字）
    weekendPlan: string; // 一起度过周末的画面（40字）
  };

  // === 为什么匹配（实际理由）===
  whyMatch: {
    lifestyleMatch: string; // 生活方式契合点（30字）
    emotionalMatch: string; // 情感需求契合点（30字）
    valueMatch: string; // 价值观契合点（30字）
  };

  // === 专属小细节 ===
  uniqueDetails: {
    catchphrase: string; // 口头禅/常说的话
    quirkyHabit: string; // 一个小癖好/小习惯
    favoriteTime: string; // 最喜欢的时间段（如"深夜"）
    comfortFood?: string; // 治愈食物（可选）
  };
}

/**
 * Compatibility analysis
 */
export interface CompatibilityAnalysis {
  overallScore: number; // 1-10
  lifestyleCompatibility: number; // 生活方式契合度
  emotionalCompatibility: number; // 情感契合度
  communicationCompatibility: number; // 沟通契合度
  valueCompatibility: number; // 价值观契合度
  
  summary: string; // 一句话总结
  highlights: string[]; // 2-3个亮点
  considerations: string[]; // 1-2个需要注意的点
}

/**
 * Extended profile with metadata
 */
export interface ProfessionalPersonalityWithMeta extends ProfessionalPersonalityProfile {
  generatedAt: string;
  version: string;
  model: string;
  compatibility?: CompatibilityAnalysis;
}

/**
 * Type guard
 */
export function isProfessionalProfile(
  profile: any
): profile is ProfessionalPersonalityProfile {
  return (
    profile &&
    typeof profile.name === "string" &&
    typeof profile.tagline === "string" &&
    profile.bigFive &&
    profile.lifeDetails &&
    profile.communication &&
    profile.personality &&
    profile.typicalBehaviors &&
    profile.togetherScenes &&
    profile.whyMatch &&
    profile.uniqueDetails
  );
}

