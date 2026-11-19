import { getNounForm, getNounPhrase } from './morphology.js';

const CASE_LABELS = {
  nominative: 'Nominativ', genitive: 'Genitiv',
  accusative: 'Akkusativ', vocative: 'Vokativ'
};
const NUMBER_LABELS = { singular: 'Singular', plural: 'Plural' };
const APPROVED = new Set(['verified_reference', 'reviewed']);

/**
 * Unicode NFC keeps visually identical Greek spellings comparable.
 * Do not remove Greek accents: they are meaningful in our exercises.
 */
export function normalizeAnswer(value) {
  if (typeof value !== 'string') return '';
  return value.normalize('NFC').trim()
    .replace(/\s+/gu, ' ')
    .toLocaleLowerCase('el');
}

/** Compare a user input with one or more approved forms. */
export function checkGrammarAnswer(input, acceptedAnswers) {
  if (!Array.isArray(acceptedAnswers) || !acceptedAnswers.length) {
    throw new Error('Keine gültigen Lösungen vorhanden.');
  }
  const answer = normalizeAnswer(input);
  return answer !== '' && acceptedAnswers.some(
    correct => answer === normalizeAnswer(correct)
  );
}

/**
 * Select a stored form; there is no automatic inflection guess.
 * mode "noun": noun alone; "phrase": definite article + noun
 */
export function generateGrammarQuestion(
  lexeme, articlesData, { number, grammaticalCase, mode = 'noun' }
) {
  if (!lexeme || lexeme.part_of_speech !== 'noun') throw new Error('Nomen erforderlich.');
  if (!APPROVED.has(lexeme.morphology?.status)) {
    throw new Error('Morphologie nicht für Übungen freigegeben.');
  }
  if (!NUMBER_LABELS[number] || !CASE_LABELS[grammaticalCase]) {
    throw new Error('Ungültige grammatische Merkmale.');
  }
  if (!['noun', 'phrase'].includes(mode)) throw new Error('Unbekannter Übungsmodus.');
  if (mode === 'phrase' && grammaticalCase === 'vocative') {
    throw new Error('Vokativ: Kein bestimmter Artikel; bitte Modus Nomen verwenden.');
  }
  const noun = getNounForm(lexeme, { number, grammaticalCase });
  const solution = mode === 'noun'
    ? noun
    : getNounPhrase(articlesData, lexeme, { number, grammaticalCase });

  return {
    id: `${lexeme.id}:${mode}:${number}:${grammaticalCase}`,
    lexemeId: lexeme.id,
    lemma: lexeme.lemma,
    number, grammaticalCase, mode,
    instruction: `Bilde ${mode === 'phrase' ? 'die Nominalphrase mit bestimmtem Artikel' : 'die Nominalform ohne Artikel'}: ${CASE_LABELS[grammaticalCase]} ${NUMBER_LABELS[number]}.`,
    acceptedAnswers: [solution]
  };
}

/**
 * For diagnosis only: discard Greek accent marks, but preserve
 * diaeresis (¨), because it can distinguish spelling/pronunciation.
 * Accent-insensitive comparison does NOT make the answer correct.
 */
export function withoutStressMarks(value) {
  return normalizeAnswer(value).normalize('NFD')
    .replace(/[\u0300\u0301\u0340\u0341\u0342]/gu, '')
    .normalize('NFC');
}

export function getGrammarFeedback(question, input) {
  if (!question || !Array.isArray(question.acceptedAnswers)) {
    throw new Error('Ungültiges Frageobjekt.');
  }
  const correct = checkGrammarAnswer(input, question.acceptedAnswers);
  if (correct) return { correct: true, errorType: null, message: 'Richtig! Die Form stimmt.' };

  const expected = question.acceptedAnswers.join(' / ');
  const actual = normalizeAnswer(input);
  if (actual === '') {
    return {
      correct: false,
      errorType: 'empty',
      message: 'Bitte gib zuerst eine griechische Form ein.'
    };
  }

  // Identical letters (including diaeresis) but different accent placement.
  if (question.acceptedAnswers.some(
    solution => withoutStressMarks(actual) === withoutStressMarks(solution)
  )) {
    return {
      correct: false,
      errorType: 'accent',
      message: `Die Buchstaben stimmen, aber die Akzentsetzung nicht. Richtige Form: ${expected}.`
    };
  }

  // In phrase mode we can give precise feedback if only the article differs.
  if (question.mode === 'phrase') {
    const tokens = actual.split(' ');
    if (tokens.length >= 2) {
      const nounInput = tokens.slice(1).join(' ');
      const nounMatches = question.acceptedAnswers.some(solution => {
        const expectedTokens = normalizeAnswer(solution).split(' ');
        return nounInput === expectedTokens.slice(1).join(' ');
      });
      if (nounMatches) return {
        correct: false,
        errorType: 'article',
        message: `Die Nominalform stimmt, aber der Artikel passt nicht. Richtige Form: ${expected}.`
      };
    }
  }

  // Do not claim to know if the error is inflection, spelling or vocabulary.
  return {
    correct: false,
    errorType: 'other',
    message: `Die Form stimmt noch nicht. Erwartete Form: ${expected}. Prüfe die Endung und die Schreibweise.`
  };
}
