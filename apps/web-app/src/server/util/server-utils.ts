import { randomBytes } from 'crypto';

export function generateSlug(length = 16) {
  return randomBytes(Math.ceil(length / 2))
    .toString('hex') // Convert bytes to hexadecimal string
    .slice(0, length); // Trim to the desired length
}
