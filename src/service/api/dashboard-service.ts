import { ApiResponse, RequestHelper } from "./request-helper";


export class DashoardService{

    private static readonly DETAILS_URL = `cycles/dashboard/`;

    public static async getDashboardDetails(): Promise<ApiResponse<any>> {
        const response = await RequestHelper.get(this.DETAILS_URL);

        return response
    }

}