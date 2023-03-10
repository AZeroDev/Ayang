import { REST, Routes } from "discord.js";
import { readdirSync } from "node:fs";

const { ClientId, GuildId, Token } = process.env;

async function register(type, commands = []) {
    // registering slash commands
    for (const directory of readdirSync("./src/commands")
        .filter(cmd => type === "guild" ? cmd : cmd.category !== "Pengembang")) {
        for (const file of readdirSync(`./src/commands/${directory}`)) {
            const command = (await import(`./src/commands/${directory}/${file}`)).default;
            commands.push(command.data.toJSON());
        }
    };

    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    switch(type) {
        case "guild":
            guild().then(() => guild(commands));
            break;
        default:
            global(commands);
            break;
    }
}

async function global(commands = []) {
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

async function guild(commands = [], guildId) {
    const rest = new REST({ version: 10 }).setToken(Token);

    try {
        const data = await rest.put(
            Routes.applicationGuildCommands(ClientId, guildId || GuildId),
            { body: commands }
        );
        console.log(`Successfully reloaded ${data.length} [Guild:${guildId || GuildId}] application (/) commands.`);
    } catch(error) {
        console.error(error);
    }
    return commands;
}

/**
 * Auto refreshing and loaded when this file opened.
 * But need check optional configuration at .env
 * */
 
if (process.env.BuildSlash === "global") {
    register();
}
else if (process.env.BuildSlash === "guild") {
    if (!GuildId) throw new Error("env(GuildId): Not found!");
    register("guild");
};

export { guild, global, register, };