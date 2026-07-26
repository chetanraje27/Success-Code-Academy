import assert from 'node:assert/strict';
import { restoreValues } from './mediaRevision';

const restored = restoreValues('banner', {
  id: 12,
  type: 'HOME',
  image: '/banner.webp',
  altText: 'Previous banner',
  targetUrl: '/courses',
  isActive: true,
  orderIndex: 2,
  createdAt: 'unsafe overwrite',
  unexpected: 'ignored',
});

assert.deepEqual(restored, {
  type: 'HOME',
  image: '/banner.webp',
  altText: 'Previous banner',
  targetUrl: '/courses',
  isActive: true,
  orderIndex: 2,
});

console.log('mediaRevision restore allowlist: ok');
