import { Client, Collection, GatewayIntentBits } from "discord.js";

const client = new Client({
    allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: false,
    },
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// client ecounters an error
client.on("error", error => console.error(error));
client.on("warn", info => console.warn(info));

import { config } from "./config.js";

// custom variable using the client object
client.commands = new Collection();
client.config = config;

// reload handler
["commands", "events", "database"]
.forEach(
    async fileName => (await import(`./handlers/${fileName}.js`)).handler(client)
);

// preload functions and check readiness for use
["miniGame"]
.forEach(
    async fileName => import(`./functions/${fileName}.js`)
);

client.login(process.env.Token);

export default client;
