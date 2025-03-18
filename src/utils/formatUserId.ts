/**
 * Converts a string ID to a UUID-compatible format
 * Simplified version for the portfolio
 */
export const formatStringToUuid = (str: string): string | null => {
  // If it already looks like a UUID, return it as is
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)) {
    return str;
  }
  
  // If string is empty, return null
  if (!str) {
    return null;
  }
  
  // Create a hash from the string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Create a valid UUID v4 format
  const hashStr = Math.abs(hash).toString(16).padStart(32, '0');
  return `${hashStr.slice(0, 8)}-${hashStr.slice(8, 12)}-4${hashStr.slice(13, 16)}-a${hashStr.slice(16, 19)}-${hashStr.slice(20, 32)}`;
};

// Keep formatUserId for backward compatibility
export const formatUserId = (userId: string): string => {
  return formatStringToUuid(userId) || userId;
};
