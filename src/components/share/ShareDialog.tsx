/**
 * ShareDialog Component
 * Dialog for generating and downloading share cards
 */

"use client";

import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { PersonalityProfile } from "@/types/personality";
import { ShareCard } from "./ShareCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personality: PersonalityProfile;
  imageUrl: string;
}

export function ShareDialog({ open, onOpenChange, personality, imageUrl }: ShareDialogProps) {
  const [template, setTemplate] = useState<"minimalist" | "elegant">("minimalist");
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);

    try {
      // Generate canvas from share card
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // High quality
        backgroundColor: null,
        logging: false,
        useCORS: true,
      });

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            throw new Error("Failed to generate image");
          }

          // Create download link
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `echo-${personality.name}-${Date.now()}.png`;
          link.click();

          // Cleanup
          URL.revokeObjectURL(url);
          setIsGenerating(false);
        },
        "image/png",
        0.95
      );
    } catch (error) {
      console.error("Failed to generate share card:", error);
      setIsGenerating(false);
      alert("生成失败，请重试");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">分享你的 Echo</DialogTitle>
          <DialogDescription>选择模板并下载分享卡片</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Selection */}
          <div className="flex gap-3">
            <Button
              variant={template === "minimalist" ? "default" : "outline"}
              onClick={() => setTemplate("minimalist")}
            >
              简约风格
            </Button>
            <Button
              variant={template === "elegant" ? "default" : "outline"}
              onClick={() => setTemplate("elegant")}
            >
              优雅风格
            </Button>
          </div>

          {/* Preview */}
          <div className="relative rounded-lg overflow-hidden shadow-2xl">
            <div
              ref={cardRef}
              className="transform scale-50 origin-top-left"
              style={{ width: "800px", height: "1200px" }}
            >
              <ShareCard personality={personality} imageUrl={imageUrl} template={template} />
            </div>
            <div className="absolute inset-0 pointer-events-none" style={{ width: "400px", height: "600px" }} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button onClick={handleDownload} disabled={isGenerating} className="gap-2">
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  下载卡片
                </>
              )}
            </Button>
          </div>

          {/* Tips */}
          <p className="text-sm text-muted-foreground text-center">
            生成高质量图片可能需要几秒钟，请耐心等待
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

