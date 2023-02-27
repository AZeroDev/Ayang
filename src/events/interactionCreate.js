import { Events } from "discord.js";

export default {
    name: Events.InteractionCreate,
    execute: async(client, interaction) => {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`Tidak ditemukan perintah yang cocok untuk '${interaction.commandName}'`);
                return;
            }

            try {
                command.execute(interaction);
            } catch(error) {
                console.error(`Kesalahan saat menjalankan '${interaction.commandName}'`, error);
            }
        }
        else if (interaction.isAutoComplete()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`Tidak ditemukan perintah yang cocok untuk '${interaction.commandName}'`);
                return;
            }

            if (command.name === "help") {
                const commands = client.commands.filter(command => !command.private).map(command => { return { name: command.name, value: command.name } });

                await interaction.respond(commands).catch(o_O => void 0);
            }
        }
    }
}