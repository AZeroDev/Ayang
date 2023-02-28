import { REST, Routes } from "discord.js";
import { readdirSync } from "node:fs";

import { client } from "../index.js";

const { ClientId, GuildId, Token } = process.env;

export async function register(type) {
    if (!client.isReady()) throw "Cannot import client before ready!";

    // registering slash commands
    const commands = [];
    client.commands
    .filter(command => command.category !== "Pengembang" && !type)
    .forEach(command => {
        commands.push(command.data.toJSON());
    });

    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    switch(type) {
        case "guild":
            guild(commands);
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
}

if (process.env.BuildSlash === "guild") {
    register("guild");
}
else {
    register();
}