import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { execSync } from "node:child_process";

export default {
    data: new SlashCommandBuilder()
        .setName("exec")
        .setDescription("Menjalankan perintah shell")
        .addStringOption(option =>
            option.setName("perintah")
                .setDescription("CLI / GUI")
                .setRequired(true)
        ),
    category: "Pengembang",
    execute: (interaction) => {
        const { colors } = interaction.client.config;
        const command = interaction.options.getString("perintah");
        const embed = new EmbedBuilder().setColor(colors.success);

        try {
            const _execute = execSync(command);
            embed.setTitle(`$ ${command}`)
            embed.setDescription(`\`\`\`shell\n${_execute}\`\`\``);

            interaction.reply({ embeds: [embed] });
        }
        catch(error) {
            embed.setColor(colors.error);
            embed.setDescription(`Tidak dapat menjalankan perintah \`$ ${command}\`, karena \`${error.message}\`.`);

            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}