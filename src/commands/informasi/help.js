import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { readdirSync } from "node:fs";

const listImage = "https://cdn-icons-png.flaticon.com/512/3597/3597156.png";

export default {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Cek informasi bantuan perintah bot")
        .addStringOption(option =>
            option.setName("nama-perintah")
                .setDescription("Menampilkan bantuan per perintah tertentu")
                .setAutocomplete(true)
        ),
    category: "Informasi",
    execute: async(interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const { colors, serverLink } = interaction.client.config;

        const query = interaction.options.getString("nama-perintah");
        const embed = new EmbedBuilder().setColor(colors.default);

        if (!query) {
            const categories = readdirSync("./src/commands").filter(category => category !== "pengembang");
            embed.setTitle("Daftar Perintah")
                .setDescription(`Untuk menggunakan perintahku selalu memakai slash (\`/\`). Gunakan \`/help nama-perintah:\` untuk menampilkan bantuan per perintah tertentu. Mau bantuan lebih lanjut? Gabung [server dukungan](${serverLink})`)
                .setThumbnail(listImage);

            categories.forEach(category => {
                category = `${category.charAt(0).toUpperCase()}${category.slice(1)}`;
                const list = interaction.client.commands.filter(cmd => cmd.category === category).map(cmd => `\`${cmd.data.name}\``);
                embed.addFields(
                    { name: `Kategori: ${category}`, value: list.join(" ") }
                )
            });

            await interaction.editReply({ embeds: [embed] });
        }
        else {
            const command = interaction.client.commands.get(query);
            if (!command) {
                embed.setColor(colors.error)
                embed.setDescription(`Oh! Aku tidak menemukan perintah \`${query}\``)
                await interaction.editReply({ embeds: [embed] });
                return;
            }
            embed.setAuthor({ name: command.data.name })
                .setTitle(`Kategori: ${command.category}`)
                .setDescription(command.data.description);

            await interaction.editReply({ embeds: [embed] });
        }
    }
}