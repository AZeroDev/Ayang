const { readdirSync } = require("node:fs");

module.exports = function load(client) {
    // commands handler
    readdirSync("./src/commands")
    .forEach(directory => {
        readdirSync(`./src/commands/${directory}`)
        .forEach(async file => {
            const command = require(`../commands/${directory}/${file}`);
            command.data = command.data.toJSON();
            client.commands.set(command.data.name, command);
        });
    });
}