import puppeteer from "puppeteer-core";
import fs from "node:fs/promises";

const FPS = 24;
const DURATION = 60;
const TOTAL = FPS * DURATION;
const OUT = "video/frames";

await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-color-profile=srgb",
    "--font-render-hinting=none",
  ],
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await page.goto("http://127.0.0.1:4180/video/film.html", { waitUntil: "networkidle0" });
await page.evaluate(async () => {
  await document.fonts.ready;
  await Promise.all(
    [...document.images].map((image) =>
      image.complete
        ? Promise.resolve()
        : new Promise((resolve) => {
            image.onload = resolve;
            image.onerror = resolve;
          }),
    ),
  );
});

const started = Date.now();
for (let i = 0; i < TOTAL; i++) {
  const t = i / FPS;
  await page.evaluate((time) => window.setTime(time), t);
  await page.screenshot({
    path: `${OUT}/frame-${String(i).padStart(5, "0")}.jpg`,
    type: "jpeg",
    quality: 92,
    optimizeForSpeed: true,
  });
  if (i % 120 === 0) {
    const elapsed = Math.round((Date.now() - started) / 1000);
    console.log(`frame ${i}/${TOTAL} · ${elapsed}s`);
  }
}

console.log(`done ${TOTAL} frames in ${Math.round((Date.now() - started) / 1000)}s`);
await browser.close();
