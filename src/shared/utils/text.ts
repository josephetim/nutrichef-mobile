export function normalizeOptionalString(value: string | null | undefined) {
  const normalized = value?.replace(/\s+/g, ' ').trim();

  if (!normalized) {
    return null;
  }

  const lowered = normalized.toLowerCase();

  if (lowered === 'null' || lowered === 'undefined') {
    return null;
  }

  return normalized;
}

export function formatInstructionSteps(instructions: string | null | undefined) {
  const normalized = normalizeOptionalString(instructions);

  if (!normalized) {
    return [];
  }

  const lines = normalized
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^step\s*\d+[:.]?\s*/i, ''));

  if (lines.length > 1) {
    return lines;
  }

  return normalized
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map((segment) => segment.trim())
    .filter(Boolean);
}
