import CryptoJS from 'crypto-js';

// Simple encryption for message content (in production, use more robust encryption)
const SECRET_KEY = 'tekpulse-message-encryption-key';

export const encryptMessage = (message: string): string => {
  try {
    return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return message; // Fallback to unencrypted
  }
};

export const decryptMessage = (encryptedMessage: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || encryptedMessage; // Fallback if decryption fails
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedMessage; // Fallback to encrypted text
  }
};

export const sanitizeInput = (input: string): string => {
  // Basic input sanitization
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .trim();
};

export const validateFileType = (file: File): boolean => {
  const allowedTypes = [
    // Images
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    // Videos
    'video/mp4',
    'video/webm',
    'video/ogg',
    // Audio
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/mpeg',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/csv',
  ];

  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSizeMB: number = 50): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};