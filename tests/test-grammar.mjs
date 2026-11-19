import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { generateGrammarQuestion, normalizeAnswer, checkGrammarAnswer, getGrammarFeedback, withoutStressMarks } from '../js/grammar.js';
const articles = JSON.parse(readFileSync(new URL('../data/articles.json', import.meta.url), 'utf8'));
const pilot = JSON.parse(readFileSync(new URL('../data/linguistic_pilot.json', import.meta.url), 'utf8'));
const get = id => pilot.lexemes.find(x => x.id === id);
const q = (id, number, grammaticalCase, mode='noun') =>
  generateGrammarQuestion(get(id),articles,{number,grammaticalCase,mode});
let count = 0;
const check = (callback) => {callback();count++;};
check(()=>assert.equal(q('lex-el-theatro','singular','genitive').acceptedAnswers[0],'θεάτρου'));
check(()=>assert.equal(q('lex-el-theatro','singular','genitive','phrase').acceptedAnswers[0],'του θεάτρου'));
check(()=>assert.equal(q('lex-el-theatro','plural','genitive','phrase').acceptedAnswers[0],'των θεάτρων'));
check(()=>assert.equal(q('lex-el-gynaika','singular','accusative','phrase').acceptedAnswers[0],'τη γυναίκα'));
check(()=>assert.equal(q('lex-el-anthropos','singular','vocative').acceptedAnswers[0],'άνθρωπε'));
check(()=>assert.equal(normalizeAnswer('  ΘΕΆΤΡΟΥ   '),'θεάτρου'));
check(()=>assert.equal(normalizeAnswer('θεα\u0301τρου'),'θεάτρου'));
check(()=>assert.equal(checkGrammarAnswer('  ΤΟΥ  ΘΕΆΤΡΟΥ ',['του θεάτρου']),true));
check(()=>assert.equal(checkGrammarAnswer('θεατρου',['θεάτρου']),false));
check(()=>assert.equal(checkGrammarAnswer('   ',['θεάτρου']),false));
check(()=>assert.throws(()=>checkGrammarAnswer('θεατρου',[]),/Keine gültigen/));

check(()=>assert.equal(getGrammarFeedback(q('lex-el-theatro','singular','genitive'),'θεατρου').correct,false));
check(()=>assert.equal(getGrammarFeedback(q('lex-el-theatro','singular','genitive'),'θεατρου').errorType,'accent'));
check(()=>assert.throws(()=>q('lex-el-esoroucha','plural','nominative'),/nicht für Übungen/));
check(()=>assert.throws(()=>q('lex-el-gynaika','singular','vocative'),/Nominalform fehlt/));
check(()=>assert.throws(()=>q('lex-el-anthropos','singular','vocative','phrase'),/kein bestimmter Artikel/i));
console.log(`${count} Grammatik-Tests erfolgreich.`);

check(()=>assert.equal(getGrammarFeedback(q('lex-el-gynaika','plural','genitive','phrase'),'των γυναικων').errorType,'accent'));
check(()=>assert.equal(getGrammarFeedback(q('lex-el-gynaika','plural','genitive','phrase'),'των γυναικών').correct,true));
check(()=>assert.equal(getGrammarFeedback(q('lex-el-gynaika','plural','genitive','phrase'),'των γυναίκων').errorType,'accent'));
check(()=>assert.equal(getGrammarFeedback(q('lex-el-gynaika','plural','genitive','phrase'),'τους γυναικών').errorType,'article'));
check(()=>assert.equal(getGrammarFeedback(q('lex-el-gynaika','plural','genitive','phrase'),'των γυναίκες').errorType,'other'));
check(()=>assert.equal(getGrammarFeedback(q('lex-el-gynaika','plural','genitive','phrase'),'').errorType,'empty'));
check(()=>assert.equal(withoutStressMarks('γυναίκων'),'γυναικων'));
check(()=>assert.equal(withoutStressMarks('γυναικών'),'γυναικων'));
check(()=>assert.equal(withoutStressMarks('αϊ'),'αϊ'));
console.log('9 zusätzliche Feedback-Tests erfolgreich.');
