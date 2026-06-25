/**
 * Hindi pages only generate for the most searched LPA values.
 * Keeps build time under GitHub Actions limits.
 * English pages still generate all 71 values.
 */

export const HI_SALARY_LPA_VALUES = [
  3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  13, 14, 15, 16, 17, 18, 20, 22, 25, 30,
  35, 40, 50
];

export const HI_TAX_SAVING_LPA_VALUES = [
  5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
  15, 16, 17, 18, 20, 22, 25, 30, 35, 40
];

export const HI_SALARY_GROWTH_LPA_VALUES = [
  5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
  15, 16, 17, 18, 20, 22, 25, 30, 35, 40
];
