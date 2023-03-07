const { Client, Collection, GatewayIntentBits } = require("discord.js");

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

// custom variable using the client object
client.commands = new Collection();
client.config = require("./config")

// reload handler
["commands", "events", "database"]
.forEach(
    fileName => require(`./handlers/${fileName}.js`).load(client)
);

// preload functions and check readiness for use
["miniGame"]
.forEach(
    fileName => require(`./functions/${fileName}.js`)
);

client.login(process.env.Token);

module.exports = client;
