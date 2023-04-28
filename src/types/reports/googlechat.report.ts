import { BasicReport } from "./basic.report";

export interface GoogleChatReport extends BasicReport {
    type: 'googlechat',
    webhook: string,
}
