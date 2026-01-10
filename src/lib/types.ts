export type Card = {
  id: string;
  word: string;          // DOG
  image?: string;        // /cards/dog.jpg (optional)
  category?: string;     // Food / Actions / Family / Colors / Objects
  prompt?: string;       // parent prompt
  soundHint?: string;    // D-d-dog
};

export type CardState = {
  box: 1 | 2 | 3 | 4 | 5;     // Leitner box
  lastSeen: number;          // ms timestamp
  correctStreak: number;
  seenCount: number;
};
