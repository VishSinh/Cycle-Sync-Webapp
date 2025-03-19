import { RequestHelper } from "./request-helper";

 

export class CycleService{
    private static readonly BASE_PATH = `cycles/`;

    private static readonly PERIODS_URL = `${this.BASE_PATH}periods/`;
    private static readonly SYMPTOMS_URL = `${this.BASE_PATH}symptoms/`;
    private static readonly CURRENT_STATUS_URL = `${this.BASE_PATH}current-status/`;

    public static async getPeriodRecords(): Promise<any> {
        const response = await RequestHelper.get(this.PERIODS_URL);
        return response
    }

    public static async creatPeriodStartEvent(dateTime?: string): Promise<any> {
        const body = {event: 1, dateTime }
        return RequestHelper.post(this.PERIODS_URL, body);
    }

    public static async creatPeriodEndEvent(dateTime?: string): Promise<any> {
        const body = {event: 2, dateTime }
        return RequestHelper.post(this.PERIODS_URL, body);
    }

    public static async getPeriodRecordDetails(periodRecordId: string): Promise<any> {
        const params = { periodRecordId }
        return RequestHelper.get(this.PERIODS_URL, params);
    }

    /**
     Symptom Occurence: 0 - All, 1 - During Period, 2 - Non Cycle Days
     */
    public static async getSymptoms(symptomOccurence?: number, page?: number, rowsPerPage?: number, startDatetime?: string, endDatetime?: string): Promise<any> {
        const params = { symptomOccurence, page, rowsPerPage, startDatetime, endDatetime }
        return RequestHelper.get(this.SYMPTOMS_URL, params);
    }

    public static async createSymptom(severity: number, date: string, symptom?: string, comments?: string): Promise<any> {
        const body = {symptom, comments, severity, date}
        return RequestHelper.post(this.SYMPTOMS_URL, body);
    }

    public static async getCurrentStatus(): Promise<any> {
        return RequestHelper.get(this.CURRENT_STATUS_URL);
    }


}