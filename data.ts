
import { Category, Phrase } from './types';

/**
 * Helper to generate phrases.
 * Now only stores the filename. The path prefix is handled by the App state.
 */
const generatePhrases = (count: number, filePrefix: string, displayName: string, useDot: boolean = false): Phrase[] => {
  return Array.from({ length: count }, (_, i) => {
    const index = i + 1;
    const separator = useDot ? '.' : '';
    const fileName = `${filePrefix}${separator}${index}.jpeg`;

    return {
      id: `${filePrefix}-${index}`,
      name: `${displayName} ${index}`,
      imageUrl: fileName, // Now just the filename: e.g. "rockbass1.jpeg"
    };
  });
};

export const DATA: Category[] = [
  {
    id: 'rock-funk',
    name: 'Rock & Funk',
    subCategories: [
      {
        id: 'rf-bass',
        name: 'Bass Drum Variables',
        phrases: generatePhrases(10, 'rockbass', 'Rock Bass'),
      },
      {
        id: 'rf-combined',
        name: 'Combined Variables',
        // Updated to use dot separator to match file convention: rockcombined.1.jpeg
        phrases: generatePhrases(10, 'rockcombined', 'Rock Combined', false),
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
        phrases: generatePhrases(12, 'swingbass', 'Swing Bass'),
      },
      {
        id: 'swing-snare',
        name: 'Snare Drum Variables',
        phrases: generatePhrases(12, 'swingsnare', 'Swing Snare'),
      },
      {
        id: 'swing-comb1',
        name: 'Combined Variables #1',
        phrases: generatePhrases(8, 'swingcombined1', 'Swing Comb 1', true),
      },
      {
        id: 'swing-comb2',
        name: 'Combined Variables #2',
        phrases: generatePhrases(8, 'swingcombined2', 'Swing Comb 2', true),
      },
    ],
  },
];

export const getFirstSubCategory = () => DATA[0].subCategories[0];
