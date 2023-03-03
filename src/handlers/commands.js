import { readdirSync } from "node:fs";

export function load(client) {
    // commands handler
    readdirSync("./src/commands")
    .forEach(directory => {
        readdirSync(`./src/commands/${directory}`)
        .forEach(async file => {
            const command = (await import(`../commands/${directory}/${file}`)).default;
            command.data = command.data.toJSON();
            client.commands.set(command.data.name, command);
        });
    });
}