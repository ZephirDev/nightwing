import { BasicReport } from "./basic.report";

export interface SmtpReport extends BasicReport {
    type: 'smtp',
    host: string,
    port: number,
    username?: string,
    password?: string,
}
