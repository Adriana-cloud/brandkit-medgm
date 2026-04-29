"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Download, ChevronDown } from "lucide-react";

type AssetType = "logo-base" | "wordmark-base" | "icon-base";
type ColorMode = "original" | "white" | "black" | "teal" | "fullwhite";
type Format = "png" | "webp";

const SIZE_MAP = {
  "logo-base": [1024, 512, 256, 128],
  "wordmark-base": [1024, 512, 256],
  "icon-base": [512, 256, 128, 64],
};

export default function BrandKit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const close = () => setOpenDropdown(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const downloadAsset = useCallback(
    (type: AssetType, size: number, color: ColorMode, format: Format) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();

      const isWhiteLetters = type === "logo-base" && color === "white";

      img.src = isWhiteLetters
        ? `/imports/${type}-white.webp`
        : `/imports/${type}.webp`;

      img.onload = () => {
        canvas.width = size;
        canvas.height = size;

        ctx.clearRect(0, 0, size, size);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        const scale = Math.min(size / img.width, size / img.height) * 0.85;
        const x = (size - img.width * scale) / 2;
        const y = (size - img.height * scale) / 2;

        if (color === "original" || isWhiteLetters) {
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        } else {
          const temp = document.createElement("canvas");
          temp.width = size;
          temp.height = size;
          const tctx = temp.getContext("2d")!;

          tctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          tctx.globalCompositeOperation = "source-in";

          if (color === "white" || color === "fullwhite") {
            tctx.fillStyle = "#ffffff";
          }

          if (color === "black") {
            tctx.fillStyle = "#000000";
          }

          if (color === "teal") {
            tctx.fillStyle = "#32b5a4";
          }

          tctx.fillRect(0, 0, size, size);
          ctx.drawImage(temp, 0, 0);
        }

        const link = document.createElement("a");
        link.download = `${type}-${color}-${size}.${format}`;
        link.href =
          format === "png"
            ? canvas.toDataURL("image/png")
            : canvas.toDataURL("image/webp");

        link.click();
        setOpenDropdown(null);
      };
    },
    []
  );

  const DownloadMenu = ({
    asset,
    color,
    label,
  }: {
    asset: AssetType;
    color: ColorMode;
    label?: string;
  }) => {
    const id = `${asset}-${color}-${label ?? "default"}`;
    const isOpen = openDropdown === id;
    const sizes = SIZE_MAP[asset];

    return (
      <div
        className="relative flex justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setOpenDropdown(isOpen ? null : id)}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full
          ${color === "white" || color === "fullwhite"
              ? "bg-white text-black"
              : color === "black"
                ? "bg-black text-white"
                : "bg-[#32b5a4] text-white"
            }`}
        >
          <Download size={14} />
          {label ?? color}
          <ChevronDown className={isOpen ? "rotate-180" : ""} size={12} />
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 z-50 w-40 bg-white rounded-xl shadow-xl border">
            {sizes.map((size) => (
              <div key={size} className="border-b last:border-none">
                <button
                  onClick={() =>
                    downloadAsset(asset, size, color, "png")
                  }
                  className="block w-full px-4 py-2 text-xs hover:bg-[#32b5a4] hover:text-white"
                >
                  {size}px PNG
                </button>
                <button
                  onClick={() =>
                    downloadAsset(asset, size, color, "webp")
                  }
                  className="block w-full px-4 py-2 text-xs hover:bg-[#32b5a4] hover:text-white"
                >
                  {size}px WEBP
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const Card = ({
    asset,
    color,
    bg,
    label,
  }: {
    asset: AssetType;
    color: ColorMode;
    bg: string;
    label?: string;
  }) => {
    const src =
      label === "white letters"
        ? `/imports/${asset}-white.webp`
        : `/imports/${asset}.webp`;

    const getFilter = () => {
      if (asset === "logo-base") {
        if (color === "original") return "";
        if (label === "white letters") return "";
        if (color === "fullwhite") return "brightness-0 invert";
        if (color === "black") return "brightness-0";
        return "";
      }

      if (asset === "wordmark-base") {
        if (color === "black") return "brightness-0";
        if (color === "white") return "brightness-0 invert";
        if (color === "teal")
          return "brightness(0) saturate(100%) invert(63%) sepia(21%) saturate(947%) hue-rotate(120deg)";
        return "";
      }

      if (asset === "icon-base") {
        if (color === "black") return "brightness-0";
        if (color === "white") return "brightness-0 invert";
        return "";
      }

      return "";
    };

    return (
      <div className={`rounded-3xl border shadow-sm ${bg}`}>
        <div className="h-48 flex items-center justify-center">
          <img src={src} className={`max-h-12 ${getFilter()}`} />
        </div>

        <div className="p-6 flex justify-center">
          <DownloadMenu asset={asset} color={color} label={label} />
        </div>
      </div>
    );
  };


  return (
    <div className="bg-[#fafafa] min-h-screen py-20 px-6">
      <canvas ref={canvasRef} className="hidden" />

      <div className="max-w-6xl mx-auto space-y-20">

        {/* MASTER LOGO */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Master Logo</h2>

          <div className="grid md:grid-cols-4 gap-6">
            <Card asset="logo-base" color="original" bg="bg-white" />
            <Card asset="logo-base" color="white" bg="bg-black" label="white letters" />
            <Card asset="logo-base" color="fullwhite" bg="bg-black" label="fullwhite" />
            <Card asset="logo-base" color="black" bg="bg-white" />

          </div>

          <p className="text-xs text-gray-400 mt-4">
            All assets are exported with transparent background. Available in PNG and WEBP.
          </p>
        </section>

        {/* WORDMARK */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Wordmark</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card asset="wordmark-base" color="black" bg="bg-white" />
            <Card asset="wordmark-base" color="white" bg="bg-black" />

          </div>

          <p className="text-xs text-gray-400 mt-4">
            Transparent PNG & WEBP formats. Optimized for clarity at all sizes.
          </p>
        </section>

        {/* ICON */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Brand Icon</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card asset="icon-base" color="original" bg="bg-white" />
            <Card asset="icon-base" color="white" bg="bg-black" />
            <Card asset="icon-base" color="black" bg="bg-white" />
          </div>

          <p className="text-xs text-gray-400 mt-4">
            Designed for UI, apps, and favicon usage. White background on export.
          </p>
        </section>
        {/* BRAND COLORS */}
        <section className="pt-10">
          <p className="text-[10px] tracking-[0.25em] text-[#c6a673] uppercase mb-3">
            Foundation
          </p>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-10">
            Brand Colors
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {/* TEAL */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-40 bg-[#32b5a4] flex items-start p-3">
                <span className="text-[10px] italic text-white/80">
                  Primary color
                </span>
              </div>
              <div className="p-6">
                <h4 className="text-sm font-semibold">Teal</h4>
                <p className="text-xs text-gray-400">#32b5a4</p>
              </div>
            </div>

            {/* GOLD */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-40 bg-[#c6a673]" />
              <div className="p-6">
                <h4 className="text-sm font-semibold">Gold</h4>
                <p className="text-xs text-gray-400">#c6a673</p>
              </div>
            </div>

            {/* WHITE */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-40 bg-white border-b" />
              <div className="p-6">
                <h4 className="text-sm font-semibold">White</h4>
                <p className="text-xs text-gray-400">#ffffff</p>
              </div>
            </div>

            {/* BLACK */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-40 bg-black" />
              <div className="p-6">
                <h4 className="text-sm font-semibold">Black</h4>
                <p className="text-xs text-gray-400">#000000</p>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
