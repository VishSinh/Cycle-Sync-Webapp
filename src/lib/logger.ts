// lib/logger.ts

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

interface LogOptions {
  level?: LogLevel;
  details?: any;
}

/**
 * Logger utility for both client and server components
 */
const logger = {
  /**
   * Log to terminal from anywhere in the application
   * @param message Message to log
   * @param options Log options (level, details)
   */
  log: async (message: string, options?: LogOptions) => {
    const isServer = typeof window === 'undefined';
    const level = options?.level || 'INFO';
    const details = options?.details;
    
    if (isServer) {
      // If running on server, log directly to terminal
      // console.log(`[${level}]`, message, details || '');
      return true;
    } else {
      // If running on client, send to API endpoint
      try {
        await fetch('/api/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ level, message, details }),
        });
        return true;
      } catch (error) {
        // Fallback to client console
        console.error('Failed to send log to server:', error);
        // console.log(`[${level}]`, message, details || '');
        return false;
      }
    }
  },
  
  // Convenience methods for different log levels
  info: (message: string, details?: any) => 
    logger.log(message, { level: 'INFO', details }),
  
  warn: (message: string, details?: any) => 
    logger.log(message, { level: 'WARN', details }),
  
  error: (message: string, details?: any) => 
    logger.log(message, { level: 'ERROR', details }),
  
  debug: (message: string, details?: any) => 
    logger.log(message, { level: 'DEBUG', details }),
};

export default logger;