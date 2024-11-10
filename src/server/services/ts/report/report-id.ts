/**
 * Helper to generate unique ids
 *
 * PROGRESS: TODO
 */

import { createHash, randomUUID } from 'node:crypto';

export function generateReportId(seed: string) {
  // TODO: Needs to reuse the report id, but right now breaks because it tries to create it again
  return randomUUID().slice(-8);
  // // Create a SHA-256 hash of the seed
  // const hash = createHash('sha256')
  //   .update(seed)
  //   .digest('hex');

  // // Return the last 8 characters of the hash
  // return hash.slice(-8);
}
