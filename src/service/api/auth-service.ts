import { RequestHelper, ApiResponse } from '@/service/api/request-helper';
import Cookies from 'js-cookie';

export class AuthService {
    private static readonly BASE_PATH = 'auth/';

    private static readonly LOGIN_URL = `${this.BASE_PATH}`;
    private static readonly SIGNUP_URL = `${this.BASE_PATH}`;

    public static async login(email: string, password: string): Promise<ApiResponse<any>> {
        const body = {
            auth_type: 1,
            email,
            password,
        };

        const response = await RequestHelper.post(this.LOGIN_URL, body);

        if (response.success && response.data) {
            this.storeAuthToken(response.data.token);
        }

        return response;
    }

    public static async signup(email: string, password: string): Promise<ApiResponse<any>> {
        const body = {
            auth_type: 2,
            email,
            password,
        }
        return RequestHelper.post(this.SIGNUP_URL, body);
    }

    public static async logout(): Promise<ApiResponse<any>> {
        this.clearAuthToken();
        return { success: true, data: null , error: null };
    }

    // ✅ Store token in cookies instead of localStorage
    public static storeAuthToken(token: string): void {
        Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'Strict' }); // Set token for 7 days
    }

    // ✅ Remove token from cookies on logout
    public static clearAuthToken(): void {
        Cookies.remove('token');
    }

    // ✅ Check if token exists in cookies
    public static isLoggedIn(): boolean {
        return !!Cookies.get('token');
    }

    // ✅ Retrieve token from cookies
    public static getAuthToken(): string | null {
        return Cookies.get('token') || null;
    }
}
