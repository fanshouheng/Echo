/**
 * Background Images Data
 * 9 images for 3×3 grid layout
 * Each image corresponds to one of the three features
 * 
 * Note: Currently using Unsplash placeholder images
 * Replace with your actual images later
 */

export interface BackgroundImage {
  id: string;
  url: string;
  description: string;
  category: "understanding" | "visualization" | "resonance";
  gridColumn: number; // 1-3
  gridRow: number; // 1-3
}

export const backgroundImages: BackgroundImage[] = [
  // 深度理解 (Understanding) - Row 1
  {
    id: "bg-1",
    url: "https://images.unsplash.com/photo-1559757148-5c3507c82635?w=800&h=600&fit=crop&q=80",
    description: "通过心理学模型深度分析你的情感模式和依恋风格",
    category: "understanding",
    gridColumn: 1,
    gridRow: 1,
  },
  {
    id: "bg-2",
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&q=80",
    description: "理解你的内心需求和情感表达方式",
    category: "understanding",
    gridColumn: 2,
    gridRow: 1,
  },
  {
    id: "bg-3",
    url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop&q=80",
    description: "基于 Big Five 人格理论和依恋理论进行科学匹配",
    category: "understanding",
    gridColumn: 3,
    gridRow: 1,
  },

  // 具象化 (Visualization) - Row 2
  {
    id: "bg-4",
    url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&q=80",
    description: "AI 将抽象的人格特质转化为像素艺术风格的视觉形象",
    category: "visualization",
    gridColumn: 1,
    gridRow: 2,
  },
  {
    id: "bg-5",
    url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop&q=80",
    description: "从数据分析到可视化呈现，让匹配结果具象化",
    category: "visualization",
    gridColumn: 2,
    gridRow: 2,
  },
  {
    id: "bg-6",
    url: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&h=600&fit=crop&q=80",
    description: "生成多场景故事画面，展现真实的生活片段",
    category: "visualization",
    gridColumn: 3,
    gridRow: 2,
  },

  // 真实共鸣 (Resonance) - Row 3
  {
    id: "bg-7",
    url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop&q=80",
    description: "不是理想化的完美，而是真实的、有温度的情感连接",
    category: "resonance",
    gridColumn: 1,
    gridRow: 3,
  },
  {
    id: "bg-8",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=600&fit=crop&q=80",
    description: "与你产生真实的共鸣，理解你的情感需求",
    category: "resonance",
    gridColumn: 2,
    gridRow: 3,
  },
  {
    id: "bg-9",
    url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=600&fit=crop&q=80",
    description: "一个有缺点但真实可爱的伴侣，与你完美互补",
    category: "resonance",
    gridColumn: 3,
    gridRow: 3,
  },
];
