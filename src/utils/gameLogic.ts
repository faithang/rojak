export interface Card {
  front: string;
  back: string;
  id: number;
}

export interface GameState {
  deck: Card[];
  currentIndex: number;
  correctCards: Set<number>;
  incorrectCards: Set<number>;
  skippedCards: number[];
  streak: number;
  longestStreak: number;
  hasCompletedCycle: boolean;
  skipsUsed: number;
  currentRound: number;
  cardsAttemptedInRound: number;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function parseCSV(csvText: string): Card[] {
  if (!csvText || typeof csvText !== "string") {
    console.error("Invalid CSV text provided");
    return [];
  }

  const lines = csvText.trim().split("\n");
  const cards: Card[] = [];

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple comma split - find the FIRST comma
    const firstCommaIndex = line.indexOf(",");
    if (firstCommaIndex === -1) {
      // Only log if it looks like actual content (not HTML)
      if (!line.startsWith("<") && line.length < 100) {
        console.warn(`Line ${i} has no comma:`, line);
      }
      continue;
    }

    const front = line.substring(0, firstCommaIndex).trim();
    const back = line.substring(firstCommaIndex + 1).trim();

    if (front && back) {
      cards.push({
        front,
        back,
        id: cards.length,
      });
    }
  }

  console.log("Total cards parsed:", cards.length);
  return cards;
}

export function initializeGame(cards: Card[]): GameState {
  return {
    deck: shuffleArray(cards),
    currentIndex: 0,
    correctCards: new Set(),
    incorrectCards: new Set(),
    skippedCards: [],
    streak: 0,
    longestStreak: 0,
    hasCompletedCycle: false,
    skipsUsed: 0,
    currentRound: 1,
    cardsAttemptedInRound: 0,
  };
}

export function getCurrentCard(state: GameState): Card | null {
  if (state.currentIndex >= state.deck.length) {
    return null;
  }
  return state.deck[state.currentIndex];
}

export function getRemainingCount(state: GameState): number {
  const totalAttempted =
    state.correctCards.size + state.incorrectCards.size;
  return state.deck.length - totalAttempted;
}

export function handleCorrect(
  state: GameState,
  cardId: number,
): GameState {
  const newCorrectCards = new Set(state.correctCards);
  newCorrectCards.add(cardId);

  const newStreak = state.streak + 1;
  const newLongestStreak = Math.max(
    state.longestStreak,
    newStreak,
  );

  return {
    ...state,
    correctCards: newCorrectCards,
    currentIndex: state.currentIndex + 1,
    streak: newStreak,
    longestStreak: newLongestStreak,
    cardsAttemptedInRound: state.cardsAttemptedInRound + 1,
  };
}

export function handleIncorrect(
  state: GameState,
  cardId: number,
): GameState {
  const newIncorrectCards = new Set(state.incorrectCards);
  newIncorrectCards.add(cardId);

  return {
    ...state,
    incorrectCards: newIncorrectCards,
    currentIndex: state.currentIndex + 1,
    streak: 0,
    cardsAttemptedInRound: state.cardsAttemptedInRound + 1,
  };
}

export function handleSkip(
  state: GameState,
  cardId: number,
): GameState {
  const newDeck = [...state.deck];
  const skippedCard = newDeck[state.currentIndex];

  // Remove from current position and add to end
  newDeck.splice(state.currentIndex, 1);
  newDeck.push(skippedCard);

  return {
    ...state,
    deck: newDeck,
    skippedCards: [...state.skippedCards, cardId],
    skipsUsed: state.skipsUsed + 1,
    cardsAttemptedInRound: state.cardsAttemptedInRound + 1,
  };
}

export function shouldResetDeck(state: GameState): boolean {
  const totalAttempted =
    state.correctCards.size + state.incorrectCards.size;
  return totalAttempted === state.deck.length;
}

export function resetDeck(
  state: GameState,
  allCards: Card[],
): GameState {
  return {
    ...initializeGame(allCards),
    longestStreak: state.longestStreak,
    hasCompletedCycle: true,
    currentRound: state.currentRound + 1,
  };
}

export function getAccuracy(state: GameState): number {
  const total =
    state.correctCards.size + state.incorrectCards.size;
  if (total === 0) return 0;
  return Math.round((state.correctCards.size / total) * 100);
}

export function getPatternString(state: GameState): string {
  const pattern: string[] = [];

  state.deck.forEach((card) => {
    if (state.correctCards.has(card.id)) {
      pattern.push("🟪");
    } else if (state.incorrectCards.has(card.id)) {
      pattern.push("⬜");
    }
  });

  return pattern.join("");
}

const CARDS_PER_ROUND = 10;

export function getCardsLeftInRound(state: GameState): number {
  const remaining = getRemainingCount(state);
  const cardsLeftInCurrentRound =
    CARDS_PER_ROUND - state.cardsAttemptedInRound;

  // If we have fewer cards remaining than what's left in the round, return the actual remaining
  return Math.min(cardsLeftInCurrentRound, remaining);
}

export function shouldShowRoundComplete(
  state: GameState,
): boolean {
  // Show round complete if we've attempted 10 cards in this round
  // OR if there are no more cards left in the deck
  return (
    state.cardsAttemptedInRound >= CARDS_PER_ROUND ||
    getRemainingCount(state) === 0
  );
}

export function startNextRound(state: GameState): GameState {
  return {
    ...state,
    currentRound: state.currentRound + 1,
    cardsAttemptedInRound: 0,
  };
}