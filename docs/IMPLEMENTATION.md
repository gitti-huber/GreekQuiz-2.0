# GreekQuiz 2.0 — Implementation notes / Entwicklungsprotokoll

## 1. Ausgangsmaterial

1. `quiz_gui(1).zip`: Original Python/Tkinter program from 2025, `quiz_gui.py`, `wordlist.csv`, a logo and 345 German answer WAV recordings.
2. `quiz_gui_Konzept(1).docx`: Original design concept: categories, question count, randomized multiple-choice, IPA, instant feedback, progress, results, flexible data imports as a desired future enhancement.
3. `greekquiz_tutoriumGPT.zip`: 2026 browser grammar pilot with `morphology.js`, `grammar.js`, `articles.json`, `linguistic_pilot.json` and tests.

## 2. Migration

- Kept the original Python, CSV and logo under `legacy/` for auditability.
- Converted each CSV row into a JSON record with original `category`, `greek`, `ipa`, `correct`, and `wrong1`–`wrong3` content, with `id` added for UI tracking.
- Kept 345 WAV files unaltered and mapped matching labels via the original Python audio-filename normalization logic. The dataset has 343 unique answer labels, of which 305 have a matching WAV filename; only mapped answers show an audio button.
- Preserved the two existing pure JavaScript language modules and both linguistic JSON sources without inferring additional morphology.
- Retained the original 9 morphology, 16 grammar, and 9 feedback checks and added JSON/audio consistency checks.

## 3. Professional interface

- Layout: academic navy sidebar, soft blue light surfaces, responsive spacing and card layouts, Mediterranean sand accents, Greek typographic hero motif.
- English UI; Greek/German learning material retained.
- Vocabulary dashboard, category/quantity configuration, interactive questions, feedback, progress, streak, results and review, retry mistakes.
- Browser-compatible HTMLAudioElement player for the source WAV files; cannot guarantee playback support on every device.
- Separate Grammar Practice and Morphology Explorer working on the existing verified pilot forms; missing forms are shown as unavailable, not guessed.
- An alphabet reference and an About page replace the simple original Tkinter dialog screens in browser-friendly form.
- No dependency on a third-party framework, CDN, server/database, or user account.

## 4. Differences / limitations

- The original Python project was **ported**, not executed in the browser. The old window-specific widgets, modal dialogs, and local filesystem lookups are replaced with browser equivalents.
- Source corpus contains 223 words; grammar pilot contains four lexical entries, not 223 morphology paradigms. Only approved forms are exercise-ready.
- CSV/JSON import of arbitrary user files and arbitrary language pairs are **future requirements** from the original concept and are **not implemented** in this release.
- Browser localStorage persists session totals only. Saved per-word learning history and spaced repetition are not implemented.
- Correct/incorrect responses are shown and mistake sets can be replayed during the current page session.
- All user data remain on the user's own device; no server-side storage.
- The app can be hosted as static files on GitHub Pages after repository setup; a live URL and QR code are not yet created.

## 5. Local verification

Command: `npm test` runs existing morphology/grammar unit checks and data/audio consistency checks. Additionally test the application manually in Firefox/Chrome and on a phone after publishing.

## 6. Next steps

1. Check published mobile rendering and audio.
2. Create GitHub repository, publish GitHub Pages, and create/test QR code.
3. Prepare the English Barcamp slides, demo script and discussion about human review of AI-generated software.
4. Only afterwards extend the verified grammar corpus and refine grammar explanations.
