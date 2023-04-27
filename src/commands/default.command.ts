import { Command } from "commander";

export default function (command: Command) {
    command.action(function () {
        console.log("test");
    });
};