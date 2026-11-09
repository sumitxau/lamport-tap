export const DROP_OPTIONS_SOL = [0.25, 0.5, 1]as const;

export type DropAmountSol = (typeof DROP_OPTIONS_SOL)[number];

export const DEFAULT_DROP_SOL: DropAmountSol = 0.5;