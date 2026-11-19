/** Morphology prototype for GreekQuiz 2.0. No DOM and no file access here. */
function normalizeGreekStart(word) {
  return word.trim().toLocaleLowerCase('el').normalize('NFD').replace(/[\u0300-\u036f]/g, '').normalize('NFC');
}

/** Find the definite article. Context is required if the form has variants. */
export function getArticle(articlesData, { gender, number, grammaticalCase, nextWord } = {}) {
  const entry = articlesData.forms.find(
    item => item.gender === gender && item.number === number && item.case === grammaticalCase
  );
  if (!entry) throw new Error(`Artikelform nicht vorhanden: ${gender}/${number}/${grammaticalCase}`);
  if (!entry.variants) return entry.form;
  if (typeof nextWord !== 'string' || !nextWord.trim()) {
    throw new Error('Für diese Artikelform ist das folgende Wort erforderlich.');
  }
  const rule = articlesData.rules.find(item => item.id === entry.rule_id);
  if (!rule) throw new Error(`Fehlende Artikelregel: ${entry.rule_id}`);
  const start = normalizeGreekStart(nextWord);
  const keepN = rule.before_vowel_or_specified_consonant.some(prefix => start.startsWith(prefix));
  const wanted = keepN ? 'before_vowel_or_specified_consonant' : 'otherwise';
  const variant = entry.variants.find(item => item.condition === wanted);
  if (!variant) throw new Error(`Fehlende Artikelvariante für: ${wanted}`);
  return variant.form;
}

/** Return a stored inflected noun form; do not guess morphology from endings. */
export function getNounForm(lexeme, { number, grammaticalCase } = {}) {
  if (!lexeme || lexeme.part_of_speech !== 'noun') throw new Error('Ein Nomen ist erforderlich.');
  if (lexeme.morphology?.status !== 'verified_reference' && lexeme.morphology?.status !== 'reviewed') {
    throw new Error(`Morphologie nicht freigegeben: ${lexeme.id}`);
  }
  const entry = lexeme.morphology.forms.find(item => item.number === number && item.case === grammaticalCase);
  if (!entry) throw new Error(`Nominalform fehlt: ${lexeme.id}/${number}/${grammaticalCase}`);
  return entry.form;
}

/** Join the two independent paradigms into a phrase. */
export function getNounPhrase(articlesData, lexeme, { number, grammaticalCase } = {}) {
  const noun = getNounForm(lexeme, { number, grammaticalCase });
  if (grammaticalCase === 'vocative') return noun; // no definite article for vocative
  const article = getArticle(articlesData, { gender: lexeme.gender, number, grammaticalCase, nextWord: noun });
  return `${article} ${noun}`;
}
