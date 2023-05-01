import configurationService from "../services/configuration.service";
import { Configuration } from "../types/configuration";
import { GoogleChatReport } from "../types/reports/googlechat.report";
import { Message } from "../types/reports/message";
import { SmtpReport } from "../types/reports/smtp.report";
import * as nodemailer from 'nodemailer';
import SMTPConnection from "nodemailer/lib/smtp-connection";
import patternsHandler from "./patterns.handler";
import { GoogleChatClient } from "../types/clients/googlechat.client";

export default new class {
    private configuration: Configuration;
    
    async getReport(key: string)
    {
        const report = this.configuration.reports[key];
        if (!report) {
            throw new Error(`Undefined ${key} report configuration`);
        }
        return report;
    }

    private async reportSmtp(name: string, report: SmtpReport, messages: Message[]): Promise<void>
    {
        let auth: SMTPConnection.AuthenticationType | null;
        if (report.username || report.password) {
            auth = {
                user: report.username,
                pass: report.password,
            };
        }

        const transport = nodemailer.createTransport({
            host: report.host,
            port: report.port,
            auth,
        });

        await transport.sendMail({
            from: report.from,
            to: report.to,
            subject: patternsHandler.getReportTitle(report, messages),
            html: patternsHandler.getReportMessage(report, messages),
        });
    }

    private async reportGoogleChat(name: string, report: GoogleChatReport, messages: Message[]): Promise<void>
    {
        const googleChatClient = new GoogleChatClient(report);
        await googleChatClient.sendMessage(
            patternsHandler.getReportTitle(report, messages),
            patternsHandler.getReportMessage(report, messages),
        );
    }

    async report(name: string, messages: Message[]): Promise<void>
    {
        if (!this.configuration) {
            this.configuration = configurationService.getConfiguration();
        }

        const report = await this.getReport(name);
        if ('smtp' === report.type) {
            await this.reportSmtp(name, report, messages);
        } else if ('googlechat' === report.type) {
            await this.reportGoogleChat(name, report, messages);
        }
    }

    async reports(messagesByReport: { [name: string]: Message[] }): Promise<void>
    {
        for (const name of Object.keys(messagesByReport)) {
            await this.report(name, messagesByReport[name]);
        }
    }
}
