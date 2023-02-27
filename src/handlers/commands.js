import { readdirSync } from "node:fs";

export function handler(client) {
    // commands handler
    readdirSync("./src/commands")
    .forEach(directory => {
        readdirSync(`./src/commands/${directory}`)
        .forEach(async file => {
            const command = (await(`../commands/${directory}/${file}`)).default;
            client.commands.set(command.data.name, command);
        });
    });
}