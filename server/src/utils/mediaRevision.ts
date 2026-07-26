import type { MediaResourceType } from '../models/MediaRevision';

const WRITABLE_FIELDS: Record<MediaResourceType, readonly string[]> = {
  banner: ['type', 'image', 'altText', 'targetUrl', 'isActive', 'orderIndex'],
  star: [
    'name',
    'score',
    'rank',
    'course',
    'year',
    'image',
    'colorHex',
    'isActive',
    'orderIndex',
  ],
  result: [
    'name',
    'image',
    'year',
    'college',
    'city',
    'marks',
    'isActive',
    'orderIndex',
  ],
};

export function restoreValues(
  resourceType: MediaResourceType,
  snapshot: Record<string, unknown>,
): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const field of WRITABLE_FIELDS[resourceType]) {
    if (Object.hasOwn(snapshot, field)) values[field] = snapshot[field];
  }
  return values;
}
