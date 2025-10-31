/**
 * Partner Generation Prompts
 * Based on attachment theory, complementarity principle, and relationship psychology
 * Output: Ideal partner personality that matches user's emotional needs and preferences
 */

import { InterviewAnswer } from "@/types/interview";
import { partnerMatchingQuestions } from "@/data/questions-partner-matching";

/**
 * System prompt for partner personality generation
 */
export const partnerGenerationSystemPrompt = `你是一位专业的关系心理学家，擅长基于依恋理论、人格互补原理和关系心理学进行伴侣匹配分析。

**你的专业背景：**
- 依恋理论：安全型、焦虑型、回避型、混乱型依恋风格
- 人格互补原理：相似性吸引 vs 互补性吸引
- 五种爱语理论：言语肯定、优质时间、身体接触、服务行动、礼物馈赠
- Big Five 人格理论在关系中的应用

**你的任务：**
基于用户的访谈回答，创造一个与其情感需求和心理特质高度匹配的理想伴侣人格。这个伴侣是：
1. 真实可信的人，有具体的性格特征和行为模式
2. 能满足用户的情感需求和依恋风格
3. 在某些方面与用户互补，在某些方面与用户相似
4. 有自己的个性和小缺点，不是完美的理想化形象

**匹配原则：**

1. **依恋风格匹配：**
   - 安全型 → 情绪稳定、可靠、支持性强的伴侣
   - 焦虑型 → 耐心、包容、善于给予安全感的伴侣
   - 回避型 → 尊重独立、不过度黏腻、理解空间需求的伴侣
   - 混乱型 → 稳定、一致、能提供情感安全的伴侣

2. **互补性原则：**
   - 内向者可能需要适度外向的伴侣带来社交活力
   - 焦虑者需要稳定的伴侣提供安全感
   - 理性者可能被感性伴侣的浪漫所吸引
   - 随性者可能需要有计划性的伴侣带来秩序

3. **相似性原则：**
   - 核心价值观需要相似或兼容
   - 生活方式和节奏需要能够协调
   - 沟通方式需要能够理解和适应

**输出风格要求：**
- ✅ 基于心理学原理，科学合理的匹配逻辑
- ✅ **极其具体的行为描述和生活场景**（这是最重要的！）
- ✅ **大量生活细节**：日常互动、具体对话、实际行为
- ✅ **丰富的场景描述**：早晨、晚上、周末、一起生活的各种时刻
- ✅ 温暖、有画面感的语言，但不过度浪漫化
- ✅ 真实的人格特征，包括优点和可爱的小缺点
- ✅ **对话示例**：具体的对话内容，让用户能"听到"TA的声音
- ✅ **生活细节**：TA的小习惯、小癖好、具体行为
- ❌ 避免完美化的理想形象
- ❌ 避免空洞的形容词堆砌
- ❌ 避免抽象的描述，必须具体到行为和场景

**重要：生活细节要求：**
- 每个场景描述至少100-200字，要详细具体
- 包含具体的对话内容、行为动作、情感反应
- 描述要让用户能"看到"和"感受到"真实的生活画面
- 包含至少10个不同的生活场景和互动细节

**输出格式：**
必须严格按照 JSON schema 输出，所有字段必须填写完整。`;

/**
 * Build partner generation prompt based on user answers
 */
export function buildPartnerGenerationPrompt(answers: InterviewAnswer[]): string {
  // Analyze user's attachment style
  const attachmentAnalysis = analyzeAttachmentStyle(answers);
  
  // Analyze emotional needs
  const emotionalNeeds = analyzeEmotionalNeeds(answers);
  
  // Analyze personality gaps (what they need complemented)
  const complementarityNeeds = analyzeComplementarityNeeds(answers);
  
  // Analyze communication and lifestyle preferences
  const preferencesAnalysis = analyzePreferences(answers);

  // Organize answers by category for context
  const answersByCategory: Record<string, string[]> = {};
  
  answers.forEach((answer) => {
    const question = partnerMatchingQuestions.find((q) => q.id === answer.questionId);
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

  const categorySummary = Object.entries(answersByCategory)
    .map(([category, answers]) => {
      const categoryName = {
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
      }[category] || category;

      return `### ${categoryName}\n${answers.join("\n")}`;
    })
    .join("\n\n");

  return `用户完成了一次基于关系心理学的深度访谈，目的是找到与其匹配的理想伴侣人格。以下是分析结果：

## 用户访谈回答
${categorySummary}

## 心理学分析

### 依恋风格分析
${attachmentAnalysis}

### 情感需求分析  
${emotionalNeeds}

### 互补性需求分析
${complementarityNeeds}

### 偏好特征分析
${preferencesAnalysis}

---

**请基于以上分析，生成一个与用户高度匹配的理想伴侣人格档案。**

**生成原则：**
1. **满足情感需求**：伴侣的性格和行为模式要能满足用户的核心情感需求
2. **依恋风格匹配**：根据用户的依恋风格，生成能提供相应支持的伴侣特质
3. **互补性平衡**：在用户的弱项上提供互补，在核心价值观上保持相似
4. **真实可信**：生成的伴侣要有真实的人格特征，不是完美的理想化形象

**输出 JSON 格式：**

\`\`\`json
{
  "name": "林晚",
  "nickname": "晚晚", 
  "age": "26-30",
  "vibe": "温柔而坚定",
  "tagline": "用温柔的坚持，守护你的每一个脆弱瞬间",
  
  "corePersonality": {
    "attachmentStyle": "安全型依恋",
    "primaryTraits": ["情绪稳定", "善解人意", "可靠", "温柔"],
    "complementaryTraits": ["比你更外向", "比你更乐观", "比你更有计划性"],
    "lovingStyle": "用行动表达爱意，细致入微的关怀"
  },
  
  "emotionalSupport": {
    "whenYouAnxious": "不会说'别想太多'，而是轻声问'需要我陪着吗？'然后就安静地坐在你身边，偶尔轻抚你的后背，让你感受到稳定的存在",
    "whenYouSad": "会准备你喜欢的热饮，然后坐在你旁边什么都不说，只是握住你的手。等你准备好了，就听你慢慢倾诉，从不打断或急着给建议",
    "whenYouHappy": "眼睛会亮起来，认真听你分享每个细节，然后说'看你开心的样子，我也好开心'，那种纯真的快乐很有感染力",
    "dailySupport": "会记住你提到的小事，比如你说明天有重要会议，TA会在前一晚发消息说'早点休息，明天加油'，第二天还会问结果如何"
  },
  
  "communicationStyle": {
    "speakingPattern": "语速不快不慢，声音温和，说话前会想一想，但不会让你等太久",
    "listeningStyle": "专注的倾听者，会看着你的眼睛，偶尔点头或轻声回应'嗯，然后呢？'让你知道TA在认真听",
    "conflictHandling": "不会逃避问题，但也不会激化矛盾。会说'我们坐下来好好聊聊'，然后耐心地表达自己的想法，也认真听你的观点",
    "expressionStyle": "更喜欢用行动表达爱意，但也会在重要时刻说出温暖的话语"
  },
  
  "lifestyleCompatibility": {
    "dailyRhythm": "作息比你规律一些，但会适应你的节奏。如果你是夜猫子，TA会陪你到稍晚，但也会温柔地提醒你早点休息",
    "socialStyle": "比你稍微外向，能在社交场合照顾你的感受，但也理解你需要独处的时间",
    "hobbySharing": "有自己的兴趣爱好，但也愿意尝试你喜欢的事情。会说'虽然我不太懂，但愿意陪你一起学'",
    "spaceBalance": "给你足够的个人空间，但也会适时地表达想念。不会黏人，但会让你感受到被关心"
  },
  
  "uniqueQualities": {
    "strengths": [
      "情绪稳定，很少有大起大落，是你的情感港湾",
      "记忆力好，会记住你说过的话和重要的日子",
      "有耐心，从不催促你做决定或改变",
      "会做饭，总能在你累的时候准备温暖的食物"
    ],
    "adorableFlaws": [
      "有时候太为你着想，会忘记表达自己的需求",
      "选择困难症，去餐厅点菜会纠结很久",
      "路痴，出门基本靠导航，但会提前查好路线"
    ],
    "dailyHabits": [
      "早上会比你先起床，轻手轻脚地准备早餐",
      "睡前会问'今天开心吗？'然后听你分享一天的感受",
      "会在你的包里偷偷放小纸条，写着'今天也要开心哦'"
    ]
  },
  
  "relationshipDynamics": {
    "intimacyLevel": "深度情感连接，但尊重边界。会逐渐了解你的内心世界，但不会强迫你分享不愿说的事情",
    "growthTogether": "相信两个人可以一起变得更好，会温柔地鼓励你尝试新事物，但从不强迫",
    "conflictResolution": "冲突时会先冷静下来，然后主动沟通。会说'我们都说出心里话吧'，然后耐心地解决问题",
    "futureVision": "对未来有温和的期待，会和你一起规划，但也接受计划的变化"
  },
  
  "whyPerfectMatch": {
    "attachmentMatch": "TA的安全型依恋风格能给你稳定感，不会因为你的焦虑而不耐烦，反而会用稳定的爱意包容你的不安",
    "emotionalMatch": "TA的情绪稳定正好平衡你的敏感，能在你情绪波动时成为你的定海神针",
    "communicationMatch": "TA的耐心倾听满足你被理解的需求，而TA的温和表达不会让你感到压力",
    "lifestyleMatch": "TA的规律性能带给你安全感，但TA的包容性也不会让你感到束缚",
    "growthMatch": "TA相信慢慢来，不会催促你改变，但会在你需要时给予支持和鼓励"
  },
  
  "loveLanguage": {
    "primary": "服务行动",
    "secondary": "优质时间", 
    "expression": "会通过照顾你的日常需求来表达爱意，比如记住你不喜欢的食物、在你生病时熬粥、在你忙碌时处理家务。同时也珍惜和你在一起的每一刻，哪怕只是安静地坐在一起"
  },
  
  "dailyLifeScenes": {
    "morningRoutine": "早上7点，TA会比你早一点醒来，轻手轻脚地起身，先拉开窗帘让阳光透进来，然后去厨房准备早餐。你闻到咖啡和烤面包的香味醒来，TA已经端着托盘回到床边，笑着说'早上好，昨晚睡得好吗？'。然后你们一起坐在床上吃早餐，TA会听你讲昨晚的梦，或者你们各自看手机，偶尔分享有趣的新闻，那种安静的陪伴很舒服。",
    "eveningRoutine": "晚上10点，如果你们都在家，TA会泡两杯热茶或热牛奶，然后你们各自坐在沙发的两端，你做你的事，TA做TA的事。偶尔TA会抬头问你'累吗？'然后过来帮你按按肩膀。睡前，TA总是会问'今天开心吗？有什么想说的吗？'然后听你分享一天的感受，或者只是说'那早点休息，明天加油'。",
    "weekendActivity": "周末的下午，如果天气好，TA会说'要不要出去走走？'不会强迫，只是提议。如果你们出门，TA会提前查好路线，准备水和小零食。走路时，TA会走在靠马路的一边，偶尔牵你的手，或者只是并肩走着。如果累了，就找个咖啡店坐下来，TA会点你喜欢的口味，然后你们一起看窗外的人来人往，聊聊天，或者各自看书，那种不尴尬的安静很舒服。",
    "cookingTogether": "一起做饭时，TA会主动承担更复杂的部分，比如切菜、炒菜，让你做简单的洗菜、摆盘。TA会问'今天想吃什么？'然后根据你的回答来准备。做饭时，TA会分享今天发生的事，或者安静地哼着歌。偶尔你会从后面抱住TA，TA会笑着说'别闹，我在炒菜呢'，但声音里是开心的。",
    "quietMoments": "有时候你们会一起待在一个空间里，但各自做自己的事。你在看书，TA在旁边画画或写东西。偶尔抬头对视一眼，会心一笑，然后又各自沉浸在自己的世界里。那种不需要说话也能感受到彼此存在的安心感，是TA最珍惜的时刻。",
    "playfulMoments": "TA偶尔会突然很孩子气，比如看到你的时候会做鬼脸，或者故意学你说话的语气。有时候你们会打闹，TA会挠你痒痒，或者突然从后面抱住你。玩累了，你们会一起倒在沙发上，TA会说'哈哈哈，你太好玩了'，然后你们一起笑，那种纯粹的快乐很珍贵。"
  },
  
  "interactionDetails": {
    "howTheyGreet": "每次见面，TA的眼睛会先亮起来，然后快步走过来，可能不会说太多话，但会给你一个温暖的拥抱，或者轻拍你的肩膀，说'你来了'，那种期待的语调会让你感到被重视。",
    "howTheySayGoodbye": "告别时，TA不会拖泥带水，但会认真地看着你的眼睛说'注意安全'或者'晚点联系'。如果是分开一段时间，TA会说'我会想你的'，然后给你一个紧紧的拥抱。如果是日常分开，可能只是一个挥手和'拜拜'，但眼神里有温柔。",
    "howTheyShowCare": "TA表达关心的方式很细致。比如你咳嗽了，TA会默默递来一杯温水；你累了，TA会主动承担更多事情；你提到想吃的东西，下次见面TA就会记得带。不是轰轰烈烈的举动，而是那种润物细无声的关怀。",
    "howTheyApologize": "如果TA做错了什么，不会马上道歉，而是先思考一下，然后认真地说'我刚才...可能不太好，对不起'。TA会解释自己的初衷，但也会承认错误。然后问'你还在生气吗？我们可以好好聊聊'，那种真诚的态度让人很难继续生气。",
    "howTheyCelebrate": "当你们一起达成什么或者有什么值得庆祝的事，TA会认真地准备，可能不是大张旗鼓，但会很用心。比如你生日，TA会提前准备好礼物，然后当天给你做一顿饭，或者带你去一个特别的地方。TA的庆祝方式是让这个时刻变得有意义，而不是形式化。",
    "howTheyComfort": "当你难过时，TA不会急着给建议或者让你'别想了'。TA会先问'需要我陪着你吗？'然后根据你的回答来决定是陪在你身边，还是给你空间。如果陪着你，TA会安静地坐着，偶尔轻抚你的后背，或者握住你的手，让你感受到稳定的存在。"
  },
  
  "livingTogether": {
    "morningScene": "如果你们住在一起，早晨的时光会是这样的：TA可能比你早一点起床，但不会吵醒你。TA会轻手轻脚地洗漱，然后去准备早餐。你醒来时，可能闻到香味，或者听到TA在厨房轻声哼歌。你走出房间，TA会回头笑着说'醒了？早餐快好了'。然后你们一起坐在餐桌前，可能聊今天的计划，或者各自看手机，偶尔分享有趣的内容。出门前，TA会检查你有没有带齐东西，然后给你们一个拥抱，说'路上小心'。",
    "eveningScene": "晚上的时光很温馨。你们各自下班回家，TA可能会先到家，已经准备了简单的晚餐或者热好了饭菜。你们一起吃饭，分享一天的经历。饭后，可能一起洗碗，或者一个人洗碗一个人收拾桌子。然后你们各自做自己的事，或者一起看一部电影，或者只是安静地坐在一起。睡前，TA总是会问'今天怎么样？'然后听你分享，或者只是说'早点休息'。",
    "weekendScene": "周末的时光很放松。不会安排太多事情，可能睡到自然醒，然后一起做早餐。下午可能一起出去逛逛，或者在家做各自的事情。TA不会强迫你做什么，但会提议'要不要...？'然后根据你的兴趣来决定。晚上可能一起做饭，或者点外卖，然后一起看电影或玩游戏。那种不急不躁的节奏很舒服。",
    "choreDistribution": "家务分工很自然，不是刻意分配的。TA可能会主动承担更多，因为TA知道你工作累。但如果你也想帮忙，TA会很开心。比如你负责洗碗，TA负责做饭；或者轮流做。不会计较谁做得多谁做得少，而是互相体谅。",
    "personalSpace": "TA很尊重你的个人空间。如果你需要独处，TA会给你时间，不会打扰。但TA也会适时地表达想念，比如发个消息说'想你了'，或者在你独处后，温柔地问'好点了吗？'那种平衡很好，既给你空间，又让你感受到被关心。",
    "sharedActivities": [
      "一起做饭，尝试新菜谱",
      "周末去公园或附近的地方散步",
      "一起看一部电影或剧集，然后讨论",
      "一起玩游戏，可能是桌游或电子游戏",
      "一起听音乐，分享各自喜欢的歌",
      "一起做家务，边做边聊天",
      "一起学习新技能，比如学做咖啡或学一门语言",
      "一起整理房间，打造共同的空间"
    ]
  },
  
  "deeperTraits": {
    "hiddenTalents": [
      "会画画，偶尔会在笔记本上画小插画，很可爱",
      "会弹一点吉他，可能不是专业水平，但能弹简单的歌",
      "会做一些手工，比如折纸、编织，会把这些小东西送给你"
    ],
    "quirks": [
      "说话前会先'嗯...'一声，像在思考",
      "紧张或专注时会不自觉地咬下唇",
      "看到可爱的东西会不自觉地'哇'一声",
      "会在手机上记录你的喜好和小习惯",
      "出门前总是要检查三遍有没有带齐东西",
      "会在镜子前整理头发很久，但又不承认",
      "开心时会不自觉地哼歌"
    ],
    "petPeeves": [
      "不太喜欢突然的打扰，特别是专注做事的时候",
      "对房间的整洁有一定要求，太乱会有点烦躁",
      "不太喜欢别人打断自己说话"
    ],
    "randomFacts": [
      "最喜欢的季节是秋天，因为觉得很有诗意",
      "害怕打雷，但会装作不怕",
      "喜欢收集好看的杯子，家里有很多",
      "最喜欢的食物是妈妈的某道菜，会尝试复刻",
      "有一个固定的睡前仪式，比如看几页书"
    ]
  },
  
  "conversationExamples": {
    "dailyCheckIn": "你：'今天怎么样？' TA：'还不错，就是有点累。你呢？' 你：'我也还行。' TA：'那晚上早点休息，我给你准备点好吃的。' 你：'好呀。' TA：'嗯，那你先忙，晚上见。'",
    "deepTalk": "你：'有时候觉得自己不够好...' TA：'为什么会这么想？' 你：'就是...' TA：'慢慢说，我在听。' 然后TA会认真听你讲完，不会急着给建议，而是说'我理解你的感受，但你知道吗，在我眼里你很好。'",
    "playfulTeasing": "你：'你好烦啊' TA：'我哪里烦了？' 你：'就是烦' TA：'那我走？' 你：'不行' TA：'那你说我哪里烦' 你：'太可爱了烦' TA：'哈哈哈你才是' 然后你们一起笑。",
    "conflictExample": "你：'我觉得你今天...' TA：'我可能确实...对不起，我没想到会让你这么想。我们能坐下来好好聊聊吗？我想知道你的感受，也想解释一下我的想法。' 然后你们会坐下来，TA会认真听你的想法，也会表达自己的观点，最后找到解决方案。",
    "supportiveWords": "你：'我明天有个重要的...' TA：'紧张吗？' 你：'有点' TA：'我相信你可以的，你之前不是也...吗？而且不管结果如何，我都支持你。如果需要我做什么，告诉我。'"
  }
}
\`\`\`

**重要提示：**
1. 所有描述必须基于用户的实际回答和心理分析
2. 伴侣特质要与用户的需求高度匹配，不是随意创造
3. 要体现心理学原理，特别是依恋理论和互补性原理
4. 描述要具体、生活化，有真实的情感温度
5. 避免过度理想化，要有真实的人格特征和小缺点
6. 每个字段都要填写完整，体现专业的心理学分析`;
}

/**
 * Analyze user's attachment style from answers
 */
function analyzeAttachmentStyle(answers: InterviewAnswer[]): string {
  const attachmentAnswers = answers.filter(a => 
    a.questionId.startsWith('p001') || a.questionId.startsWith('p002')
  );
  
  let analysis = "基于用户在亲密关系中的表现：\n";
  
  attachmentAnswers.forEach(answer => {
    if (answer.questionId === 'p001') {
      if (typeof answer.answer === 'string') {
        if (answer.answer.includes('anxious')) {
          analysis += "- 表现出焦虑型依恋特征：容易担心关系，需要经常确认\n";
        } else if (answer.answer.includes('avoidant')) {
          analysis += "- 表现出回避型依恋特征：重视独立，不喜欢过度依赖\n";
        } else if (answer.answer.includes('secure')) {
          analysis += "- 表现出安全型依恋特征：能够平衡独立和亲密\n";
        } else if (answer.answer.includes('disorganized')) {
          analysis += "- 表现出混乱型依恋特征：对亲密关系有矛盾情感\n";
        }
      }
    }
  });
  
  return analysis;
}

/**
 * Analyze user's emotional needs
 */
function analyzeEmotionalNeeds(answers: InterviewAnswer[]): string {
  const needsAnswers = answers.filter(a => 
    a.questionId.startsWith('p003') || a.questionId.startsWith('p004') || a.questionId.startsWith('p017')
  );
  
  let analysis = "用户的核心情感需求：\n";
  
  needsAnswers.forEach(answer => {
    if (answer.questionId === 'p003' && typeof answer.answer === 'string') {
      if (answer.answer.includes('security')) {
        analysis += "- 最需要安全感和稳定感\n";
      } else if (answer.answer.includes('understanding')) {
        analysis += "- 最需要理解和共鸣\n";
      } else if (answer.answer.includes('freedom')) {
        analysis += "- 最需要自由和空间\n";
      } else if (answer.answer.includes('attention')) {
        analysis += "- 最需要陪伴和关注\n";
      } else if (answer.answer.includes('growth')) {
        analysis += "- 最需要成长和激励\n";
      }
    }
  });
  
  return analysis;
}

/**
 * Analyze what personality traits user needs complemented
 */
function analyzeComplementarityNeeds(answers: InterviewAnswer[]): string {
  // p007: User's personality traits (what they have)
  const userTraitsAnswer = answers.find(a => a.questionId === 'p007');
  
  let analysis = "基于用户的性格特征，推断需要的互补特质：\n";
  
  if (userTraitsAnswer && Array.isArray(userTraitsAnswer.answer)) {
    const userTraits = userTraitsAnswer.answer as string[];
    
    // Infer complementary needs based on what user lacks
    if (userTraits.includes('user_introverted') && !userTraits.includes('user_extroverted')) {
      analysis += "- 用户较内向，可能需要适度外向的伴侣带来社交活力\n";
    }
    if (userTraits.includes('user_anxious') && !userTraits.includes('user_stable')) {
      analysis += "- 用户容易焦虑，需要情绪稳定的伴侣提供安全感\n";
    }
    if (userTraits.includes('user_indecisive') && !userTraits.includes('user_decisive')) {
      analysis += "- 用户不够果断，需要更果断的伴侣帮助决策\n";
    }
    if (userTraits.includes('user_rational') && !userTraits.includes('user_romantic')) {
      analysis += "- 用户较理性，可能需要更感性的伴侣带来浪漫\n";
    }
    if (userTraits.includes('user_spontaneous') && !userTraits.includes('user_planned')) {
      analysis += "- 用户较随性，可能需要更有计划性的伴侣规划生活\n";
    }
    if (userTraits.includes('user_serious') && !userTraits.includes('user_humorous')) {
      analysis += "- 用户较严肃，可能需要更幽默的伴侣带来快乐\n";
    }
    
    // If user already has certain traits, partner can be similar or complementary
    if (userTraits.includes('user_extroverted')) {
      analysis += "- 用户较外向，伴侣可以是外向或内向（都能匹配）\n";
    }
    if (userTraits.includes('user_stable')) {
      analysis += "- 用户情绪稳定，伴侣也应该是稳定的\n";
    }
  }
  
  return analysis;
}

/**
 * Analyze user's communication and lifestyle preferences
 */
function analyzePreferences(answers: InterviewAnswer[]): string {
  let analysis = "用户的沟通和生活偏好：\n";
  
  // Add analysis based on communication, lifestyle, and other preference answers
  const prefAnswers = answers.filter(a => 
    ['communication', 'lifestyle', 'values', 'intimacy'].includes(
      partnerMatchingQuestions.find(q => q.id === a.questionId)?.category || ''
    )
  );
  
  prefAnswers.forEach(answer => {
    const question = partnerMatchingQuestions.find(q => q.id === answer.questionId);
    if (question) {
      analysis += `- ${question.text}：${Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer}\n`;
    }
  });
  
  return analysis;
}

/**
 * Parse partner personality JSON response
 */
export function parsePartnerPersonalityJSON(response: string): unknown {
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

