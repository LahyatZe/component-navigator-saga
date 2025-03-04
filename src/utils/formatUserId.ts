
/**
 * Converts a Clerk user ID to a UUID-compatible format for database operations
 * Ensures consistent formatting across the application
 */
export const formatUserId = (userId: string): string => {
  // If it already looks like a UUID, return it as is
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
    return userId;
  }
  
  // For Clerk IDs (starting with 'user_'), create a deterministic UUID
  if (userId.startsWith('user_')) {
    // Create a hash from the user ID
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Create a valid UUID v4 format (with specific version bits)
    const hashStr = Math.abs(hash).toString(16).padStart(32, '0');
    return `${hashStr.slice(0, 8)}-${hashStr.slice(8, 12)}-4${hashStr.slice(13, 16)}-a${hashStr.slice(16, 19)}-${hashStr.slice(20, 32)}`;
  }
  
  // If it's an email address or another format, hash it
  if (userId.includes('@') || userId.length > 0) {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    const hashStr = Math.abs(hash).toString(16).padStart(32, '0');
    return `${hashStr.slice(0, 8)}-${hashStr.slice(8, 12)}-4${hashStr.slice(13, 16)}-a${hashStr.slice(16, 19)}-${hashStr.slice(20, 32)}`;
  }
  
  return userId; // Return as is for other formats
};
