import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { AuthService } from '@/service/api/auth-service';
import { NextResponse } from 'next/server';
import Routes from '@/lib/routes';
import logger from '@/lib/logger';

export interface RequestOptions {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    params?: Record<string, string | number | boolean | undefined>;
    headers?: Record<string, string>;
    timeout?: number;
    withCredentials?: boolean;
}

export interface ErrorDetails {
    code: string;
    message: string;
    details: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data: T | null;
    error: ErrorDetails | null;
    status?: number;
}

export class RequestHelper {
    private static readonly DEFAULT_TIMEOUT = 30000; // 30 seconds
    private static readonly BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://0.0.0.0:8000/api/v1/';

    /**
     * Makes an HTTP request with provided options
     * @param options The request options
     * @returns A promise with the API response
     */
    public static async makeRequest<T = any>(options: RequestOptions): Promise<ApiResponse<T>> {
        const {
            url,
            method,
            body,
            params,
            headers = {},
            timeout = this.DEFAULT_TIMEOUT,
            withCredentials = true,
        } = options;

        // Add the Authorization header if a token is present in local storage
        const token = AuthService.getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Convert request body and params from camelCase to snake_case
        const snakeCaseBody = body ? this.convertKeysToSnakeCase(body) : body;
        const snakeCaseParams = params ? this.convertKeysToSnakeCase(params) : params;

        // logger.info('Making API request', {
        //     url: this.getFullUrl(url),
        //     method,
        //     body: snakeCaseBody,
        //     params: snakeCaseParams,
        // });

        const config: AxiosRequestConfig = {
            url: this.getFullUrl(url),
            method,
            params: snakeCaseParams,
            data: snakeCaseBody,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            timeout,
            withCredentials,
            // Add this to ensure errors are thrown for non-2xx status codes
            validateStatus: (status) => status >= 200 && status < 300,
        };

        try {
            const response: AxiosResponse = await axios(config);

            // Convert snake_case keys to camelCase in the response data
            const convertedData = this.convertKeysToCamelCase(response.data);
            
            // If the API already returns in our expected format, use it directly
            if (convertedData.hasOwnProperty('success') && 
                convertedData.hasOwnProperty('data') && 
                convertedData.hasOwnProperty('error')) {
                return {
                    ...convertedData,
                    status: response.status
                } as ApiResponse<T>;
            }
            
            // Otherwise, transform to our expected format
            return {
                success: true,
                data: convertedData,
                error: null,
                status: response.status,
            };
        } catch (error) {
            const axiosError = error as AxiosError;

            // Log the error (consider using a logging service in production)
            console.log('API request failed:', {
                url: config.url,
                method: config.method,
                status: axiosError.response?.status,
                error: axiosError.message,
            });

            // Handle 401 Unauthorized errors
            if (axiosError.response?.status === 401) {
                // Clear authentication token
                AuthService.clearAuthToken();
                
                // Redirect to auth page
                if (typeof window !== 'undefined') {
                    window.location.href = Routes.LOGIN;
                } else {
                    // Handle server-side redirect if needed
                    return {
                        success: false,
                        data: null,
                        error: {
                            code: 'UNAUTHORIZED',
                            message: 'Session expired. Please log in again.',
                            details: ''
                        },
                        status: 401,
                        redirect: Routes.LOGIN
                    } as ApiResponse<T>;
                }
            }

            // If the server returned an error in our format, use it
            if (axiosError.response?.data && 
                typeof axiosError.response.data === 'object' &&
                axiosError.response.data.hasOwnProperty('success') && 
                axiosError.response.data.hasOwnProperty('error')) {
                
                // Convert snake_case keys to camelCase in the error response
                const convertedErrorData = this.convertKeysToCamelCase(axiosError.response.data);
                
                return {
                    ...convertedErrorData,
                    status: axiosError.response.status
                };
            }

            // Otherwise create our own error format
            const errorDetails = this.createErrorDetails(axiosError);
            
            return {
                success: false,
                data: null,
                error: errorDetails,
                status: axiosError.response?.status,
            };
        }
    }

    /**
     * GET request helper
     */
    public static async get<T = any>(
        url: string,
        params?: RequestOptions['params'],
        headers?: RequestOptions['headers']
    ): Promise<ApiResponse<T>> {
        return this.makeRequest<T>({ url, method: 'GET', params, headers });
    }

    /**
     * POST request helper
     */
    public static async post<T = any>(
        url: string,
        body?: RequestOptions['body'],
        params?: RequestOptions['params'],
        headers?: RequestOptions['headers']
    ): Promise<ApiResponse<T>> {
        return this.makeRequest<T>({ url, method: 'POST', body, params, headers });
    }

    /**
     * PUT request helper
     */
    public static async put<T = any>(
        url: string,
        body?: RequestOptions['body'],
        params?: RequestOptions['params'],
        headers?: RequestOptions['headers']
    ): Promise<ApiResponse<T>> {
        return this.makeRequest<T>({ url, method: 'PUT', body, params, headers });
    }

    /**
     * DELETE request helper
     */
    public static async delete<T = any>(
        url: string,
        params?: RequestOptions['params'],
        headers?: RequestOptions['headers']
    ): Promise<ApiResponse<T>> {
        return this.makeRequest<T>({ url, method: 'DELETE', params, headers });
    }

    /**
     * PATCH request helper
     */
    public static async patch<T = any>(
        url: string,
        body?: RequestOptions['body'],
        params?: RequestOptions['params'],
        headers?: RequestOptions['headers']
    ): Promise<ApiResponse<T>> {
        return this.makeRequest<T>({ url, method: 'PATCH', body, params, headers });
    }

    /**
     * Constructs the full URL for the request
     */
    private static getFullUrl(url: string): string {
        // Check if the URL already includes http:// or https://
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }

        // Ensure the base URL ends with a slash if it's not empty and the path doesn't start with one
        if (this.BASE_URL && !this.BASE_URL.endsWith('/') && !url.startsWith('/')) {
            return `${this.BASE_URL}/${url}`;
        }

        return `${this.BASE_URL}${url}`;
    }

    /**
     * Creates error details based on the axios error
     */
    private static createErrorDetails(error: AxiosError): ErrorDetails {
        if (error.response) {
            // Server responded with a status code outside the 2xx range
            const status = error.response.status;
            const message = this.getErrorMessage(error);
            
            let code = `HTTP_${status}`;
            let errorMessage = message;
            let details = '';
            
            switch (status) {
                case 400:
                    code = 'BAD_REQUEST';
                    errorMessage = `Bad Request: ${message}`;
                    break;
                case 401:
                    code = 'UNAUTHORIZED';
                    errorMessage = 'Unauthorized: Authentication required';
                    break;
                case 403:
                    code = 'FORBIDDEN';
                    errorMessage = 'Forbidden: You do not have permission to access this resource';
                    break;
                case 404:
                    code = 'NOT_FOUND';
                    errorMessage = 'Not Found: The requested resource was not found';
                    break;
                case 409:
                    code = 'CONFLICT';
                    errorMessage = 'There was a conflict with the request';
                    break;
                case 422:
                    code = 'VALIDATION_ERROR';
                    errorMessage = 'Validation Error: The request data is invalid';
                    break;
                case 500:
                    code = 'SERVER_ERROR';
                    errorMessage = 'Internal Server Error: Something went wrong on the server';
                    break;
                default:
                    code = `HTTP_${status}`;
                    errorMessage = `HTTP Error ${status}: ${message}`;
            }
            
            return {
                code,
                message: errorMessage,
                details: JSON.stringify(error.response.data) || ''
            };
        } else if (error.request) {
            // Request was made but no response was received
            if (error.code === 'ECONNABORTED') {
                return {
                    code: 'TIMEOUT',
                    message: 'Request timeout: The server took too long to respond',
                    details: ''
                };
            }
            return {
                code: 'NETWORK_ERROR',
                message: 'Network Error: Unable to connect to the server',
                details: error.message
            };
        } else {
            // Something happened in setting up the request
            return {
                code: 'REQUEST_SETUP_ERROR',
                message: `Request Error: ${error.message}`,
                details: ''
            };
        }
    }

    /**
     * Attempts to extract a meaningful error message from the error response
     */
    private static getErrorMessage(error: AxiosError): string {
        const responseData = error.response?.data as any;

        if (typeof responseData === 'string') {
            return responseData;
        }

        if (responseData?.message) {
            return responseData.message;
        }

        if (responseData?.error?.message) {
            return responseData.error.message;
        }

        if (responseData?.error) {
            return typeof responseData.error === 'string'
                ? responseData.error
                : JSON.stringify(responseData.error);
        }

        return error.message || 'Unknown error occurred';
    }

    /**
     * Converts snake_case keys to camelCase in an object or array recursively
     * @param data The data to convert
     * @returns The converted data
     */
    private static convertKeysToCamelCase(data: any): any {
        if (data === null || data === undefined) {
            return data;
        }

        if (Array.isArray(data)) {
            return data.map(item => this.convertKeysToCamelCase(item));
        }

        if (typeof data === 'object' && !Array.isArray(data)) {
            const newObj: any = {};
            
            Object.keys(data).forEach(key => {
                // Convert the key from snake_case to camelCase
                const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
                
                // Convert any nested objects or arrays
                newObj[camelKey] = this.convertKeysToCamelCase(data[key]);
            });
            
            return newObj;
        }
        
        return data;
    }

    /**
     * Converts camelCase keys to snake_case in an object or array recursively
     * @param data The data to convert
     * @returns The converted data
     */
    private static convertKeysToSnakeCase(data: any): any {
        if (data === null || data === undefined) {
            return data;
        }

        if (Array.isArray(data)) {
            return data.map(item => this.convertKeysToSnakeCase(item));
        }

        if (typeof data === 'object' && !Array.isArray(data)) {
            const newObj: any = {};
            
            Object.keys(data).forEach(key => {
                // Convert the key from camelCase to snake_case
                const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
                
                // Convert any nested objects or arrays
                newObj[snakeKey] = this.convertKeysToSnakeCase(data[key]);
            });
            
            return newObj;
        }
        
        return data;
    }
}