/**
 * Background Images Data
 * 9 images for 3×3 grid layout
 * Each image corresponds to one of the three features
 * 
 * Images are generated locally and saved in public/images/background/
 * Generated using AI with 9 different anime art styles
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
  // 深度理解 (Understanding) - Row 1)
  {
    id: "bg-1",
    url: "/images/background/bg-1.jpg",
    description: "雨天里，为小猫撑起一把伞",
    category: "understanding",
    gridColumn: 1,
    gridRow: 1,
  },
  {
    id: "bg-2",
    url: "/images/background/bg-2.jpg",
    description: "在咖啡厅角落，静静地阅读",
    category: "understanding",
    gridColumn: 2,
    gridRow: 1,
  },
  {
    id: "bg-3",
    url: "/images/background/bg-3.jpg",
    description: "深夜里，对着数据图表发呆",
    category: "understanding",
    gridColumn: 3,
    gridRow: 1,
  },

  // 具象化 (Visualization) - Row 2
  {
    id: "bg-4",
    url: "/images/background/bg-4.jpg",
    description: "日落时分，站在站台眺望城市",
    category: "visualization",
    gridColumn: 1,
    gridRow: 2,
  },
  {
    id: "bg-8",
    url: "/images/background/bg-8.jpg",
    description: "她喜欢玩游戏，经常开黑到很晚",
    category: "resonance",
    gridColumn: 2,
    gridRow: 2,
  },
  {
    id: "bg-6",
    url: "/images/background/bg-6.jpg",
    description: "樱花飞舞的公园里，漫步前行",
    category: "visualization",
    gridColumn: 3,
    gridRow: 2,
  },

  // 真实共鸣 (Resonance) - Row 3
  {
    id: "bg-7",
    url: "/images/background/bg-7.jpg",
    description: "周末总会去球场，打篮球是他最放松的时刻",
    category: "resonance",
    gridColumn: 1,
    gridRow: 3,
  },
  {
    id: "bg-5",
    url: "/images/background/bg-5.jpg",
    description: "在书店里，静静地阅读",
    category: "visualization",
    gridColumn: 2,
    gridRow: 3,
  },
  {
    id: "bg-9",
    url: "/images/background/bg-9.jpg",
    description: "清晨的厨房里，准备早餐",
    category: "resonance",
    gridColumn: 3,
    gridRow: 3,
  },
];
