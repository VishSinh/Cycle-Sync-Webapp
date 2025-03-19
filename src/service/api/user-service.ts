import { RequestHelper, ApiResponse } from '@/service/api/request-helper';
import { AuthService } from './auth-service';


export class UserService{
    private static readonly BASE_PATH = 'users/';

    private static readonly DETAILS_URL = `${this.BASE_PATH}details/`;

    private static removeNullValues(obj: Record<string, any>): Record<string, any> {
        return Object.entries(obj)
            .filter(([_, value]) => value !== null && value !== undefined)
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    }

    public static async getUserDetails(): Promise<ApiResponse<any>> {
        return RequestHelper.get(this.DETAILS_URL);
    }

    public static async addUserDetails(
        firstName: string,
        lastName: string,
        lastPeriodStart: string,
        dob?: string | null,
        height?: number | null,
        weight?: number | null,
        lastPeriodEnd?: string | null,
        ongoingPeriod?: boolean | null,
    ): Promise<ApiResponse<any>> {

        if (!ongoingPeriod && !lastPeriodEnd) {
            throw new Error('lastPeriodEnd is required if ongoingPeriod is false');
        }

        const body = {
            firstName,
            lastName,
            dob,
            height,
            weight,
            lastPeriodStart,
            lastPeriodEnd,
            ongoingPeriod
        };

        const cleanedBody = this.removeNullValues(body);

        const response = await RequestHelper.post(this.DETAILS_URL, cleanedBody);

        if (response.success) {
            AuthService.setOnboardingCompleted(true);
        }

        return response;
    }

    public static async updateUserDetails(firstName: string, lastName: string, dob?: string | null, height?: number | null, weight?: number | null): Promise<ApiResponse<any>> {

        const body = {
            firstName,
            lastName,
            dob,
            height,
            weight
        };
        
        const cleanedBody = this.removeNullValues(body);

        const response = await RequestHelper.patch(this.DETAILS_URL, cleanedBody);

        return response;
    }
}