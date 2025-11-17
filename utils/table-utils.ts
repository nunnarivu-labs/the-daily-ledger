export const getOffsetFromIndex = (index: number, limit: number): number =>
  Math.floor(index / limit) * limit;
