# ChopWeti product film

**Master:** `chopweti-product-film-1080p.mp4`
1920×1080 · 24 fps · 60 seconds · H.264 + AAC · stereo

**Cover:** `chopweti-cover.jpg`
**Subtitles / transcript:** `chopweti-film.srt`
**Poster frame:** `chopweti-poster.jpg`

## Story

| Time | Scene |
| --- | --- |
| 0:00–0:05 | Cold open: the pot mark and “Chop weti?” |
| 0:05–0:11 | The problem: the dish is known, the measurements are not |
| 0:11–0:19 | Set the table: household, allergies, goals, pepper intensity |
| 0:19–0:27 | Tonight: a recommendation that fits the table |
| 0:27–0:36 | The cook: guided steps, tips and completion ticks |
| 0:36–0:45 | The hard part: prepared ingredients from verified neighbours |
| 0:45–0:52 | Trust: a correspondent, a regulator, a date |
| 0:52–1:00 | End card: ChopWeti, Bamenda |

## Production

- The UI was captured from the running React app at 1440×1000.
- The motion graphics are a deterministic HTML/CSS/JS composition in `film.html`.
- Frames were captured with Puppeteer at 24 fps and encoded with ffmpeg.
- Music is an original synthesized arrangement (`assets/soundtrack.wav`).
- Voiceover is a synthetic en-GB voice, edited line by line to the scene timings.
- The final audio mix is `assets/final-mix-loud.wav`.

## Rebuild

1. Serve the app root on `http://127.0.0.1:4180`.
2. Open `video/film.html` and check frames with `window.setTime(seconds)`.
3. Run `node video/render-frames.mjs`.
4. Encode with ffmpeg using the existing `frames/` folder and `assets/final-mix-loud.wav`.

The source app is in the parent directory. All music and voice assets are generated for
this project; the photography is credited in the app’s **Photo credits** page.
