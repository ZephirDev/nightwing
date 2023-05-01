import { BasicReport } from "../types/reports/basic.report";
import { Message } from "../types/reports/message";
import * as handelbars from 'handlebars';
import * as crypto from 'crypto';
import fsService from "../services/fs.service";
import defaultReportTitleTemplate from '../assets/default.report.title.template.json';
import defaultReportContentTemplate from '../assets/default.report.content.template.json';
import lengthHelper from "../handlebars/helpers/length.helper";

export default new class {
    private cachedTemplate: { [name: string]: HandlebarsTemplateDelegate };

    constructor()
    {
        handelbars.registerHelper('length', lengthHelper);
    }

    private hashString(content: string): string
    {
        const sum = crypto.createHash('md5');
        sum.update(content);
        return sum.digest('hex');
    }

    getReportTitle(report: BasicReport, messages: Message[]): string
    {
        const file = report.titlePatternFile
            ? fsService.getReportTemplateFile(report.titlePatternFile)
            : null;
        
        let delegate: HandlebarsTemplateDelegate;
        if (report.titlePattern) {
            const hash = this.hashString(report.titlePattern);
            delegate = this.cachedTemplate[hash];
            if (!delegate) {
                delegate = Handlebars.compile(report.titlePattern);
                this.cachedTemplate[hash] = delegate;
            }
        } else if (file && file.exists()) {
            delegate = this.cachedTemplate[file.toString()];
            if (!delegate) {
                delegate = Handlebars.compile(file.read());
                this.cachedTemplate[file.toString()] = delegate;
            }
        } else {
            const defaultTemplate = fsService.getDefaultReportTitleTemplate();
            if (!defaultTemplate.exists()) {
                let template = defaultReportTitleTemplate.join('\n');
                defaultTemplate.write(template);
                delegate = Handlebars.compile(template);
                this.cachedTemplate[defaultTemplate.toString()] = delegate;
            } else {
                delegate = this.cachedTemplate[defaultTemplate.toString()];
                if (!delegate) {
                    delegate = Handlebars.compile(defaultTemplate.read());
                    this.cachedTemplate[defaultTemplate.toString()] = delegate;
                }
            }
        }

        return delegate({
            report,
            messages,
        });
    }

    getReportMessage(report: BasicReport, messages: Message[]): string
    {
        const file = report.messagePatternFile
            ? fsService.getReportTemplateFile(report.messagePatternFile)
            : null;
        
        let delegate: HandlebarsTemplateDelegate;
        if (report.messagePattern) {
            const hash = this.hashString(report.messagePattern);
            delegate = this.cachedTemplate[hash];
            if (!delegate) {
                delegate = Handlebars.compile(report.messagePattern);
                this.cachedTemplate[hash] = delegate;
            }
        } else if (file && file.exists()) {
            delegate = this.cachedTemplate[file.toString()];
            if (!delegate) {
                delegate = Handlebars.compile(file.read());
                this.cachedTemplate[file.toString()] = delegate;
            }
        } else {
            const defaultTemplate = fsService.getDefaultReportContentTemplate(report.type);
            if (!defaultTemplate.exists()) {
                let template = defaultReportContentTemplate[report.type as keyof typeof defaultReportContentTemplate].join('\n');
                defaultTemplate.write(template);
                delegate = Handlebars.compile(template);
                this.cachedTemplate[defaultTemplate.toString()] = delegate;
            } else {
                delegate = this.cachedTemplate[defaultTemplate.toString()];
                if (!delegate) {
                    delegate = Handlebars.compile(defaultTemplate.read());
                    this.cachedTemplate[defaultTemplate.toString()] = delegate;
                }
            }
        }

        return delegate({
            report,
            messages,
        });
    }

}