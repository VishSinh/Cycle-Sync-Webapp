import { RequestHelper, ApiResponse } from '@/service/api/request-helper';


export class UserService{
    private static readonly BASE_PATH = 'users/';

    private static readonly DETAILS_URL = `${this.BASE_PATH}details/`;

    public static async getUserDetails(): Promise<ApiResponse<any>> {
        const response = await RequestHelper.get(this.DETAILS_URL);

        return response
    }

    public static async addUserDetails(firstName: string, lastName: string, dob?: string | null, height?: number | null, weight?: number | null): Promise<ApiResponse<any>> {

        const body = {
            firstName,
            lastName,
            dob,
            height,
            weight
        }

        const response = await RequestHelper.post(this.DETAILS_URL, body);

        return response;
    }

    public static async updateUserDetails(firstName: string, lastName: string, dob?: string | null, height?: number | null, weight?: number | null): Promise<ApiResponse<any>> {

        const body = {
            firstName,
            lastName,
            dob,
            height,
            weight
        }

        const response = await RequestHelper.patch(this.DETAILS_URL, body);

        return response;
    }


    
}