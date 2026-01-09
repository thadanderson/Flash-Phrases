export interface Phrase {
  id: string;
  name: string;
  imageUrl: string; // Placeholder for the actual .jpeg path
}

export interface SubCategory {
  id: string;
  name: string;
  phrases: Phrase[];
}

export interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

export enum PlayState {
  STOPPED = 'STOPPED',
  COUNT_IN = 'COUNT_IN',
  PLAYING = 'PLAYING',
}

export type RepetitionOption = 1 | 2 | 4 | 8;