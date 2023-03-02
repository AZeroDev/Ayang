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
                        .setDescription("Tebak gambar acak")
                )
                .addSubcommand(subCommand =>
                    subCommand.setName("lirik")
                        .setDescription("Tebak lirik acak")
                )
                .addSubcommand(subCommand =>
                    subCommand.setName("kata")
                        .setDescription("Tebak kata acak")
                )
                .addSubcommand(subCommand =>
                    subCommand.setName("kalimat")
                        .setDescription("Tebak kalimat acak")
                )
                .addSubcommand(subCommand =>
                    subCommand.setName("tebakan")
                        .setDescription("Tebak tebakan acak")
                )
        )
        .addSubcommand(subCommand =>
            subCommand.setName("asah-otak")
                .setDescription("Pertanyaan acak untuk mengasah otak")
        )
        .addSubcommand(subCommand =>
            subCommand.setName("cak-lontong")
                .setDescription("Pertanyaan acak penuh lawak dan jawaban konyol")
        )
        .addSubcommand(subCommand =>
            subCommand.setName("family-100")
                .setDescription("Pertanyaan acak dari family-100")
        )
        .addSubcommand(subCommand =>
            subCommand.setName("siapa-aku")
                .setDescription("Pertanyaan acak menebak siapa aku")
        )
        .addSubcommand(subCommand =>
            subCommand.setName("susun-kata")
                .setDescription("Pertanyaan acak untuk menyusun kata")
        )
        .addSubcommand(subCommand =>
            subCommand.setName("teka-teki")
                .setDescription("Pertanyaan acak penuh dengan teka teki")
        ),
    category: "Permainan",
    execute: async(interaction) => {
        let command = `/${interaction.commandName}`;
        if (interaction.options.getSubcommandGroup()) {
            command += ' '+interaction.options.getSubcommandGroup();
        }
        if (interaction.options.getSubcommand()) {
            command += ' '+interaction.options.addSubcommand();
        }

        await interaction.reply({ content: command, ephemeral: true });
    }
}