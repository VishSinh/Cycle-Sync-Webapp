import { toast } from 'sonner';
import logger from '@/lib/logger';

interface ApiOptions {
  showToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

export async function apiWrapper<T>(
  apiCall: () => Promise<T>,
  options: ApiOptions = { showToast: true }
): Promise<{ response: T | null; error: Error | null }> {
  try {
    const response = await apiCall();
    
    if (options.successMessage && options.showToast) {
      toast.success(options.successMessage);
    }
    
    return { response, error: null };
  } catch (error: any) {
    const errorMessage = error.message || options.errorMessage || "Something went wrong";
    
    logger.error(error);
    
    if (options.showToast) {
      toast.error(errorMessage);
    }
    
    return { response: null, error };
  }
}