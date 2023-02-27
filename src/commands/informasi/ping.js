import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Cek latensi bot"),
    execute: (interaction) => {
        interaction.reply({ content: "Pinging...", ephemeral: true, fetchReply: true }).then(message => {
            message.edit(`Pong! **${interaction.createdTimestamp - message.createdTimestamp}** ms`);
        });
    }
}