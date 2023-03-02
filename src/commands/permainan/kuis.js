import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("kuis")
        .setDescription("Untuk hiburan, mengasah otak, dll")
        .addSubcommandGroup(subCommandGroup =>
            subCommandGroup.setName("tebak")
                .setDescription("Grup permainan menebak")
                .addSubcommand(subCommand =>
                    subCommand.setName("gambar")
                        .setDescription("Main tebak gambar")
                )
                .addSubcommand(subCommand =>
                    subCommand.setName("lirik")
                        .setDescription("Main tebak lirik")
                )
                .addSubcommand(subCommand =>
                    subCommand.setName("kata")
                        .setDescription("Main tebak kata")
                )
                .addSubcommand(subCommand =>
                    subCommand.setName("kalimat")
                        .setDescription("Main tebak kalimat")
                )
                .addSubcommand(subCommand =>
                    subCommand.setName("tebakan")
                        .setDescription("Main tebak tebakan")
                )
        ),
    category: "Permainan",
    execute: async(interaction) => {
        await interaction.reply({ content: `${interaction.options.getSubcommandGroup()} ${interaction.options.getSubcommand()}`, ephemeral: true });
    }
}