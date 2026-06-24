import { Transform } from 'class-transformer';

export function emptyStringToUndefined({ value }: { value: unknown }) {
  if (typeof value === 'string' && value.trim() === '') {
    return undefined;
  }
  if (typeof value === 'string') {
    return value.trim();
  }
  return value;
}

export const OptionalStringTransform = () => Transform(emptyStringToUndefined);
