import { REST, Routes } from "discord.js";
import { readdirSync } from "node:fs";

const { ClientId, GuildId, Token } = process.env;

async function register(type) {
    // registering slash commands
    const commands = [];
    for (const directory of readdirSync("./src/commands")
        .filter(cmd => type === "guild" ? cmd : cmd.category !== "Pengembang")) {
        for (const file of readdirSync(`./src/commands/${directory}`)) {
            const command = (await import(`../commands/${directory}/${file}`)).default;
            commands.push(command.data.toJSON());
        }
    };

    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    switch(type) {
        case "guild":
            guild([]).then(() => guild(commands));
            break;
        default:
            global(commands);
            break;
    }
}

async function global(commands) {
    const rest = new REST({ version: 10 }).setToken(Token);

    try {
        const data = await rest.put(
            Routes.applicationCommands(ClientId),
            { body: commands }
        );
        console.log(`Successfully reloaded ${data.length} [Global] application (/) commands.`);
    } catch(error) {
        console.error(error);
    }
    return commands;
}

async function guild(commands) {
    const rest = new REST({ version: 10 }).setToken(Token);

    try {
        const data = await rest.put(
            Routes.applicationGuildCommands(ClientId, GuildId),
            { body: commands }
        );
        console.log(`Successfully reloaded ${data.length} [Guild:${GuildId}] application (/) commands.`);
    } catch(error) {
        console.error(error);
    }
    return commands;
}

if (process.env.BuildSlash === "global") {
    register();
}
else if (process.env.BuildSlash === "guild") {
    register("guild");
};

export default {
    builds: {
        global,
        guild,
    },
    register,
};
