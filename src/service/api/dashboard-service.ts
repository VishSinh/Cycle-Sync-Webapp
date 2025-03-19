import { ApiResponse, RequestHelper } from "./request-helper";


export class DashoardService{

    private static readonly DASHBOARD_URL = `cycles/dashboard/`;

    private static readonly DASHBOARD_DETAILS_URL = `cycles/dashboard/details/`;

    public static async getDashboardDetails(): Promise<ApiResponse<any>> {
        const response = await RequestHelper.get(this.DASHBOARD_URL);

        return response
    }

    public static async getDashboardDetailsData(phase: number): Promise<ApiResponse<any>> {
        const params = {phase}
        const response = await RequestHelper.get(this.DASHBOARD_DETAILS_URL, params);

        return response
    }

}