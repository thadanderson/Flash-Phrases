
import { Category, Phrase } from './types';

/**
 * Helper to generate phrases.
 * Now only stores the filename. The path prefix is handled by the App state.
 */
// Glob all card images from the public folder based on the project structure
// Key format example: "/public/cards/rockbass1.jpeg"
const ALL_CARDS = import.meta.glob('/public/cards/*.jpeg');

/**
 * Helper to generate phrases dynamically based on available files.
 * It looks for files matching the pattern: {filePrefix}{separator}{number}.jpeg
 */
const generatePhrases = (filePrefix: string, displayName: string, useDot: boolean = false): Phrase[] => {
  const separator = useDot ? '.' : '';

  // Filter and map relevant files
  const phrases = Object.keys(ALL_CARDS)
    .filter((path) => {
      const fileName = path.split('/').pop();
      if (!fileName) return false;

      // Check if file starts with prefix + separator
      // and ends with .jpeg
      // and has a number in between
      // escaping the dot for regex if needed, but here we just check raw string start
      if (!fileName.startsWith(`${filePrefix}${separator}`)) return false;
      if (!fileName.endsWith('.jpeg')) return false;

      // Ensure the part between prefix and extension is a number
      // fileName: rockbass1.jpeg
      // prefix: rockbass
      // remainder: 1.jpeg
      // remove .jpeg -> 1
      const remainder = fileName.slice((filePrefix + separator).length, -5); // -5 for ".jpeg"
      return /^\d+$/.test(remainder);
    })
    .map((path) => {
      const fileName = path.split('/').pop()!;
      // Extract number for sorting and display
      const remainder = fileName.slice((filePrefix + separator).length, -5);
      const index = parseInt(remainder, 10);

      return {
        id: `${filePrefix}-${index}`,
        name: `${displayName}`,
        imageUrl: fileName, // just the filename, app adds prefix path
        index, // temporary for sorting
      };
    });

  // Sort numerically
  phrases.sort((a, b) => a.index - b.index);

  // Return strictly the Phrase[] (remove temporary sort key)
  return phrases.map(({ index, ...phrase }) => phrase);
};

export const DATA: Category[] = [
  {
    id: 'rock-funk',
    name: 'Rock & Funk',
    subCategories: [
      {
        id: 'rf-bass',
        name: 'Bass Drum Variables',
        phrases: generatePhrases('rockbass', 'Rock Bass'),
      },
      {
        id: 'rf-combined',
        name: 'Combined Variables',
        // Updated to use dot separator to match file convention: rockcombined.1.jpeg
        phrases: generatePhrases('rockcombined', 'Rock Combined', false),
      },
    ],
  },
  {
    id: 'swing',
    name: 'Swing',
    subCategories: [
      {
        id: 'swing-bass',
        name: 'Bass Drum Variables',
        phrases: generatePhrases('swingbass', 'Swing Bass'),
      },
      {
        id: 'swing-snare',
        name: 'Snare Drum Variables',
        phrases: generatePhrases('swingsnare', 'Swing Snare'),
      },
      {
        id: 'swing-comb1',
        name: 'Combined Variables #1',
        phrases: generatePhrases('swingcombined1', 'Swing Comb 1', true),
      },
      {
        id: 'swing-comb2',
        name: 'Combined Variables #2',
        phrases: generatePhrases('swingcombined2', 'Swing Comb 2', true),
      },
    ],
  },
];

export const getFirstSubCategory = () => DATA[0].subCategories[0];
