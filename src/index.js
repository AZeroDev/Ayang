import { Client, Collection, GatewayIntentBits } from "discord.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// client ecounters an error
client.on("error", error => console.error(error));
client.on("warn", info => console.warn(info));

import { config } from "./config.js";

// custom variable using the client object
client.commands = new Collection();
client.config = config;

// reload handler
["commands", "events"]
.forEach(file => file.handler(client));

client.login(process.env.Token);

export default client;
