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
            if (interaction.isAutocomplete()) {
                if (interaction.commandName === "help") {
                    const commands = client.commands.filter(command => !command.private).map(command => { return { name: command.data.name, value: command.data.name } });

                    return await interaction.respond(commands).catch(o_O => void 0);
                }
            }

            try {
                command.execute(interaction);
            } catch(error) {
                console.error(`Kesalahan saat menjalankan '${interaction.commandName}'`, error);
            }
        }
    }
}