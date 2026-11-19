import assert from 'node:assert/strict';
import fs from 'node:fs';
const vocabulary=JSON.parse(fs.readFileSync('./data/vocabulary.json','utf8'));
const audio=JSON.parse(fs.readFileSync('./data/audio-index.json','utf8'));
const pilot=JSON.parse(fs.readFileSync('./data/linguistic_pilot.json','utf8'));
assert.equal(vocabulary.length,223);
assert.equal(new Set(vocabulary.map(x=>x.category)).size,14);
for(const word of vocabulary){assert.ok(word.greek&&word.correct&&word.category);assert.ok(Array.isArray(word.wrong));assert.ok(new Set([word.correct,...word.wrong]).size>=4,`Not enough unique answers for ${word.greek}`)}
for(const file of Object.values(audio)){assert.ok(fs.existsSync('./audio_options/'+file),file)}
assert.ok(pilot.lexemes.length>=4);
console.log('Vocabulary, categories and audio references: OK');
