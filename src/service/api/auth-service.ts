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

            this.setOnboardingCompleted(response.data.exists)
        }

        return response;
    }

    public static async signup(email: string, password: string): Promise<ApiResponse<any>> {
        const body = {
            auth_type: 2,
            email,
            password,
        }

        const response = await RequestHelper.post(this.SIGNUP_URL, body);
        
        if (response.success && response.data) {
            this.storeAuthToken(response.data.token);

            this.setOnboardingCompleted(false);
        }

        return response;
    }

    public static async logout(): Promise<ApiResponse<any>> {
        this.clearAuthToken();
        this.clearOnboardingCompleted();
        return { success: true, data: null , error: null };
    }

    /*
    TOKEN MANAGEMENT
    */
    public static storeAuthToken = (token: string): void => Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'Strict' });
    
    public static clearAuthToken = (): void =>  Cookies.remove('token');
    
    public static isLoggedIn = (): boolean =>  !!Cookies.get('token');

    public static getAuthToken = (): string | null => Cookies.get('token') ?? null;


    /*
    ONBOARDING
    */
    public static setOnboardingCompleted = (completed: boolean): void => Cookies.set('onboarding_completed', completed.toString());
    
    public static isOnboardingCompleted = (): boolean => !!Cookies.get('onboarding_completed');

    public static clearOnboardingCompleted = (): void => Cookies.remove('onboarding_completed');



    
}
