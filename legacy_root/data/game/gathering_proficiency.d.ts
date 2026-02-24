export const GATHERING_ATTRS: Record<string, { primary: string; secondary: string }>;
export interface GatherOptions {
  success?: boolean;
}
export function gainGatherProficiency(
  character: Record<string, any>,
  skillKey: string,
  opts?: GatherOptions,
): number;
export function performGathering(
  character: Record<string, any>,
  skillKey: string,
  opts?: GatherOptions,
): number;
