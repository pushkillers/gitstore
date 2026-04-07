"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

export function ImageCarousel({ images, alt, className = "" }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-[#0d1117] ${className}`}>
        <p className="text-[#7d8590]">Nenhuma imagem disponível</p>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="relative aspect-video overflow-hidden bg-[#0d1117]">
        <Image
          src={images[currentIndex]}
          alt={`${alt} - Screenshot ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority
        />

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-[#30363d] bg-[#0d1117]/80 text-[#e6edf3] backdrop-blur-sm transition-all hover:bg-[#161b22] hover:border-[#484f58]"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-[#30363d] bg-[#0d1117]/80 text-[#e6edf3] backdrop-blur-sm transition-all hover:bg-[#161b22] hover:border-[#484f58]"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? "w-8 bg-[#58a6ff]"
                    : "w-2 bg-[#30363d] hover:bg-[#484f58]"
                }`}
                aria-label={`Ir para imagem ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Image Counter */}
        <div className="absolute top-3 right-3 rounded-full border border-[#30363d] bg-[#0d1117]/80 px-3 py-1 text-xs font-medium text-[#e6edf3] backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
