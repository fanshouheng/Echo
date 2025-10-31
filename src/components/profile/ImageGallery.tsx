/**
 * ImageGallery Component
 * Display and select from generated images
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useGenerationStore } from "@/store/generation";
import { Check, ImageIcon } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
}

/**
 * Check if image URL is from Pollinations AI
 * Pollinations AI URLs don't need Next.js Image optimization proxy
 */
function isPollinationsUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === "image.pollinations.ai" || urlObj.hostname.includes("pollinations.ai");
  } catch {
    // If URL parsing fails, check if it contains pollinations
    return url.includes("pollinations.ai");
  }
}

/**
 * Pollinations Image Component with retry mechanism
 * Pollinations AI images may take 10-30 seconds to generate, so we retry loading
 */
function PollinationsImage({
  src,
  alt,
  index,
  loadedImages,
  errorImages,
  onLoad,
  onError,
}: {
  src: string;
  alt: string;
  index: number;
  loadedImages: Set<number>;
  errorImages: Set<number>;
  onLoad: () => void;
  onError: () => void;
}) {
  const [retryCount, setRetryCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle retry when image fails to load
  const handleError = useCallback(() => {
    if (retryCount < 5) {
      // Wait before retry (give Pollinations time to generate)
      const delay = 10000; // 10 seconds between retries
      console.log(`⚠️ Image ${index + 1} load error (attempt ${retryCount + 1}/6), retrying in ${delay/1000}s...`);
      
      retryTimeoutRef.current = setTimeout(() => {
        console.log(`🔄 Retrying image ${index + 1} (attempt ${retryCount + 2}/6)...`);
        setRetryCount(prev => prev + 1);
        // Add timestamp to force reload and bypass cache
        const separator = src.includes('?') ? '&' : '?';
        const newSrc = `${src}${separator}_retry=${Date.now()}`;
        setCurrentSrc(newSrc);
      }, delay);
    } else {
      // All retries exhausted
      console.error(`❌ Image ${index + 1} failed after 6 attempts (60+ seconds)`);
      onError();
    }
  }, [retryCount, index, src, onError]);

  // Update currentSrc when src changes (for retries)
  useEffect(() => {
    if (imgRef.current && currentSrc !== imgRef.current.src) {
      imgRef.current.src = currentSrc;
    }
  }, [currentSrc]);

  // Cleanup timeout on unmount or when loaded
  useEffect(() => {
    if (loadedImages.has(index) && retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [loadedImages, index]);

  if (loadedImages.has(index)) {
    return (
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-300"
      />
    );
  }

  return (
    <>
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        onLoad={() => {
          console.log(`✅ Image ${index + 1} loaded successfully`);
          onLoad();
        }}
        onError={handleError}
      />
      {!loadedImages.has(index) && retryCount < 5 && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <div className="text-center text-xs text-muted-foreground">
            <ImageIcon className="w-6 h-6 mx-auto mb-1 animate-pulse" />
            <p>生成中... ({retryCount + 1}/6)</p>
          </div>
        </div>
      )}
    </>
  );
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const { selectedImageIndex, selectImage } = useGenerationStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<number>>(new Set());

  // Debug: Log images array
  useEffect(() => {
    console.log("🖼️ ImageGallery - Images count:", images.length);
    console.log("🖼️ ImageGallery - Images URLs:", images);
    images.forEach((url, idx) => {
      console.log(`🖼️ Image ${idx + 1}:`, url);
    });
  }, [images]);

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
          {images.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-8">
              <p>暂无图片</p>
            </div>
          ) : (
            images.map((imageUrl, index) => (
              <motion.div
                key={`image-${index}-${imageUrl.substring(0, 50)}`} // More unique key
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative aspect-square group cursor-pointer"
                onClick={() => handleImageClick(index)}
              >
              {/* Image */}
              <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors bg-muted/30">
                {errorImages.has(index) ? (
                  // Error state - show placeholder
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mb-2" />
                    <p className="text-xs">加载失败</p>
                  </div>
                ) : (
                  <>
                    {isPollinationsUrl(imageUrl) ? (
                      // Use direct img tag for Pollinations AI with retry mechanism
                      <PollinationsImage
                        src={imageUrl}
                        alt={`Echo 形象 ${index + 1}`}
                        index={index}
                        loadedImages={loadedImages}
                        errorImages={errorImages}
                        onLoad={() => {
                          console.log(`✅ Image ${index + 1} loaded successfully`);
                          setLoadedImages(prev => new Set(prev).add(index));
                        }}
                        onError={() => {
                          console.error(`❌ Failed to load image ${index + 1}`);
                          setErrorImages(prev => new Set(prev).add(index));
                        }}
                      />
                    ) : (
                      // Use Next.js Image for other sources
                      <Image
                        src={imageUrl}
                        alt={`Echo 形象 ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    )}
                    
                    {/* Loading placeholder */}
                    {!loadedImages.has(index) && !errorImages.has(index) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted/50 animate-pulse">
                        <ImageIcon className="w-8 h-8 text-muted-foreground animate-pulse" />
                      </div>
                    )}
                  </>
                )}
                
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
          ))
        )}
        </div>
        
        {/* Image count indicator */}
        <p className="text-sm text-center text-muted-foreground">
          共 {images.length} 张图片 {loadedImages.size > 0 && `(${loadedImages.size} 张已加载)`}
        </p>

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
              {isPollinationsUrl(images[selectedImageIndex]) ? (
                // Use direct img tag for Pollinations AI to avoid proxy timeout
                <img
                  src={images[selectedImageIndex]}
                  alt="Echo 形象"
                  className="w-full h-full object-contain"
                />
              ) : (
                // Use Next.js Image for other sources
                <Image
                  src={images[selectedImageIndex]}
                  alt="Echo 形象"
                  fill
                  className="object-contain"
                  sizes="90vw"
                />
              )}
              
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

