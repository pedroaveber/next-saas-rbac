export function createSlug(text: string): string {
  return text
    .toString() // Convert to string (in case it's not)
    .normalize('NFD') // Normalize the string to decompose combined characters into their base characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks (accents)
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading and trailing whitespace
    .replace(/[^a-z0-9 -]/g, '') // Remove invalid characters (keep only alphanumeric characters, spaces, and hyphens)
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
}
