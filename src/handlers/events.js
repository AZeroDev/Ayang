import { readdirSync } from "node:fs";

export function load(client) {
    // events handler
    readdirSync("./src/events")
    .forEach(async file => {
        const events = (await import(`../events/${file}`)).default;
        if (events.once) {
            client.once(events.name, events.execute.bind(null, client));
        } else {
            client.on(events.name, events.execute.bind(null, client));
        }
    });
}