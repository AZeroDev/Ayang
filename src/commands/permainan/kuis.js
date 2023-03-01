import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("kuis")
        .setDescription("Gunakan perintah ini untuk melihat semua fiturnya")
        .addSubcommandGroup(subCommandGroup =>
            subCommandGroup.setName("tebak")
                .setDescription("Grup permainan menebak")
                .addSubcommand(subCommand =>
                    subCommand.setName("gambar")
                        .setDescription("Tebak gambar")
                )
                .addSubcommand(subCommand =>
                    subCommand.setName("lirik")
                        .setDescription("Tebak lirik")
                )
                .addSubcommand(subCommand =>
                    subCommand.setName("kata")
                        .setDescription("Tebak kata")
                )
                .addSubcommand(subCommand =>
                    subCommand.setName("kalimat")
                        .setDescription("Tebak kalimat")
                )
                .addSubcommand(subCommand =>
                    subCommand.setName("tebakan")
                        .setDescription("Tebak tebakan")
                )
        ),
    category: "Permainan",
    execute: async(interaction) => {
        await interaction.reply({ content: `${interaction.options.getSubcommandGroup()} ${interaction.options.getSubcommand()}`, ephemeral: true });
    }
}