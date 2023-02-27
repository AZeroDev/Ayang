import { Events } from "discord.js";

export default {
    name: Events.ClientReady,
    once: true,
    execute: (client) => {
        console.log(`Ready! Logged as ${client.user.tag}`);
        client.user.setActivity({ name: "/help" });
    }
}