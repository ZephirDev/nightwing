import { Command } from "commander";
import surveysHandler from "../handlers/surveys.handler";

export default function (command: Command) {
    command
        .description('Execute the surveys configured.')
        .action(surveysHandler.handle.bind(surveysHandler));
};