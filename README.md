# GreekQuiz 2.0 — Learn Greek. Explore Language.

Modern Greek–German vocabulary and grammar web app, built from the original 2025 Python/Tkinter project and the 2026 morphology/grammar pilot.

## Quick start (Windows, VS Code)

1. Extract the project ZIP into `D:\FH\GreekQuiz-2.0` (or another folder).
2. Open this folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Start a simple local server:

   ```powershell
   py -m http.server 8000
   ```

5. Open **http://localhost:8000** in your browser. Stop the server with `Ctrl+C`.

**Important:** Do not launch `index.html` directly using `file://` — JavaScript `fetch()` needs a web server. For an alternative, use VS Code's Live Server extension.

## Run automated checks

With Node.js installed, execute in the project's root directory:

```powershell
npm test
```

## Included features

- Responsive, English-language user interface; Greek words and German translations retained.
- All 223 original vocabulary entries and 14 categories, multiple-choice questions with four unique answers.
- Question counts of 3/5/10/20/all (automatically capped to available category size).
- Random questions and answer order, instant feedback, progress bar and consecutive-answer streaks.
- IPA display toggle, keyboard shortcuts 1–4 and Enter.
- 345 original German WAV files; playback buttons when a recording matches an answer.
- Score screen, answer-by-answer correct/incorrect review, replay of mistakes.
- Local-only session statistics in browser localStorage (no login, no analytics or backend).
- Grammar input exercises and morphology viewer based on **stored, verified/reviewed** noun forms and the original article dataset.
- Grammar errors distinguish empty responses, accents, incorrect articles, and other errors.
- Greek alphabet reference, About page.

## Architecture

- `index.html` — interface structure (English)
- `css/styles.css` — design system and responsive layouts
- `js/app.js` — page navigation, vocabulary quiz, UI handlers and integration
- `js/morphology.js` — preserved morphological transformations/lookup rules
- `js/grammar.js` — preserved question creation and grammar feedback
- `data/vocabulary.json` — **lossless content migration** from original `wordlist.csv` (223 rows)
- `data/linguistic_pilot.json` — existing grammar pilot with verified vs. review-needed status
- `data/articles.json` — article paradigm and rule metadata
- `data/audio-index.json` — mappings from German answer strings to original WAV filenames
- `audio_options/` — 345 original German WAV recordings
- `legacy/` — unmodified originals (Python code, CSV, logo)
- `tests/` — existing morphology & grammar tests and new dataset tests

### Content boundaries

The original vocabulary data are not expanded or corrected by AI, and the grammar pilot is **not** a general Greek morphological engine. Unverified forms are not generated and may be unavailable. Grammar practice uses only the existing pilot nouns, not all 223 vocabulary rows. Audio files are **German translations**, not Modern Greek recordings. This is a static web app, not a multiuser backend.

## Publish via GitHub Pages

Create a **public** repository (e.g. `greekquiz-2`), copy this project's contents to the repository root, commit and push, then in repository **Settings → Pages**, choose **Deploy from a branch**, branch `main`, folder `/(root)`. The published site should have a URL similar to `https://YOUR-USERNAME.github.io/greekquiz-2/` (verify the actual URL in GitHub). Generate a QR code **only after** the live site is tested from a phone. The repo includes about 46MB of WAV audio, so page load speed depends on connectivity, although individual sounds download only when played.

## Suggested checks before the Barcamp presentation

- Desktop and mobile: homepage layout, navigation, quiz start, four responses, audio, IPA toggle, full score summary, retry mistakes, grammar form and errors, morphology forms, alphabet.
- Test the **published** URL on a phone via mobile network (not only in your own Wi-Fi).
- Confirm QR code opens the intended URL and no site path is missing.

## Attribution and development history

Original desktop app (2025) by Sandra Ziagos. GreekQuiz 2.0 integrates the original source and existing prototype with a modern static web interface. Consult `docs/IMPLEMENTATION.md` for a feature-by-feature migration summary. Keep source provenance when extending linguistic data.
