/**
 * ImageGallery Component
 * Display and select from generated images
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useGenerationStore } from "@/store/generation";
import { Check } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const { selectedImageIndex, selectImage } = useGenerationStore();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleSelectImage = (index: number) => {
    selectImage(index);
  };

  const handleImageClick = (index: number) => {
    selectImage(index);
    setIsFullscreen(true);
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-center text-foreground">
          TA 的形象
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative aspect-square group cursor-pointer"
              onClick={() => handleImageClick(index)}
            >
              {/* Image */}
              <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors">
                <Image
                  src={imageUrl}
                  alt={`Echo 形象 ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                
                {/* Selected indicator */}
                {selectedImageIndex === index && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg"
                  >
                    <Check className="w-5 h-5 text-primary-foreground" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-sm text-center text-muted-foreground">
          点击选择你最喜欢的形象
        </p>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedImageIndex]}
                alt="Echo 形象"
                fill
                className="object-contain"
                sizes="90vw"
              />
              
              {/* Close hint */}
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                点击任意处关闭
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

