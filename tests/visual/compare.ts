import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { ssim } from "ssim.js";

export interface VisualMetrics {
  width: number;
  height: number;
  mismatchedPixels: number;
  mismatchedRatio: number; // 0..1
  meanAbsRgbDiff: number;
  ssim: number;
  largestBlobEdge: number; // side of largest 32x32 grid cell fully mismatched
}

export function loadPng(file: string): PNG {
  return PNG.sync.read(fs.readFileSync(file));
}

export function compareImages(actualPath: string, goldenPath: string, diffPath: string): VisualMetrics {
  const a = loadPng(actualPath);
  const b = loadPng(goldenPath);
  if (a.width !== b.width || a.height !== b.height) {
    throw new Error(`Size mismatch: actual ${a.width}x${a.height} vs golden ${b.width}x${b.height}`);
  }
  const { width, height } = a;
  const diff = new PNG({ width, height });

  const mismatchedPixels = pixelmatch(a.data, b.data, diff.data, width, height, {
    threshold: 0.1,
    includeAA: true,
  });

  fs.mkdirSync(path.dirname(diffPath), { recursive: true });
  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  // mean absolute RGB difference
  let sum = 0;
  for (let i = 0; i < a.data.length; i += 4) {
    sum +=
      (Math.abs(a.data[i] - b.data[i]) +
        Math.abs(a.data[i + 1] - b.data[i + 1]) +
        Math.abs(a.data[i + 2] - b.data[i + 2])) /
      3;
  }
  const meanAbsRgbDiff = sum / (width * height);

  // SSIM (grayscale, via ssim.js on ImageData-like structs)
  const toImageData = (p: PNG) => ({
    data: new Uint8ClampedArray(p.data),
    width: p.width,
    height: p.height,
  });
  const { mssim } = ssim(toImageData(a), toImageData(b));

  // largest contiguous mismatch region approximation on a 32px grid
  const cell = 32;
  let largestBlobEdge = 0;
  for (let cy = 0; cy < Math.floor(height / cell); cy++) {
    for (let cx = 0; cx < Math.floor(width / cell); cx++) {
      let bad = 0;
      for (let y = cy * cell; y < (cy + 1) * cell; y++) {
        for (let x = cx * cell; x < (cx + 1) * cell; x++) {
          const idx = (y * width + x) * 4;
          if (diff.data[idx] === 255 && diff.data[idx + 1] === 0) bad++;
        }
      }
      if (bad >= cell * cell * 0.9) largestBlobEdge = Math.max(largestBlobEdge, cell);
    }
  }

  return {
    width,
    height,
    mismatchedPixels,
    mismatchedRatio: mismatchedPixels / (width * height),
    meanAbsRgbDiff,
    ssim: mssim,
    largestBlobEdge,
  };
}
