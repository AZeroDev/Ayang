const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Mengirim latensi bot"),
    category: "Informasi",
    execute: async(interaction) => {
        const timestamp = await Date.now();
        await interaction.reply({ content: "Pinging...", ephemeral: true });

        await interaction.editReply(`Pong! **${timestamp - interaction.createdTimestamp}** ms`);
        return;
    }
}