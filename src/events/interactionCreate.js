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
        else if (interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`Tidak ditemukan perintah yang cocok untuk '${interaction.commandName}'`);
                return;
            }

            if (interaction.commandName === "help") {
                const commands = client.commands.filter(cmd => !cmd.private);

                await interaction.respond(
                    commands.map(cmd => ({ name: cmd.data.name, value: cmd.data.name }))
                ).catch(o_O => void 0);
            }
        }

    }
}