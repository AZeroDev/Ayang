import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { readdirSync } from "node:fs";

export default {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Menampilkan informasi bantuan perintah bot")
        .addStringOption(option =>
            option.setName("nama-perintah")
                .setDescription("Menampilkan detail per perintah tertentu")
                .setAutocomplete(true)
        ),
    category: "Informasi",
    execute: async(interaction) => {
        const { colors, serverLink } = interaction.client.config;

        const query = interaction.options.getString("nama-perintah");
        const embed = new EmbedBuilder().setColor(colors.default);
        const buttons = [];

        if (!query) {
            const categories = readdirSync("./src/commands").filter(category => category !== "pengembang");
            embed.setTitle("Daftar Perintah")
                .setDescription(`Prefix perintahku: \`/\`\nGunakan \`/help [nama-perintah]\` untuk info bantuan per perintah tertentu.\nMau bantuan lebih lanjut? gabung [Server Dukungan](${serverLink})`)
                .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 512 }))
                .setFooter({ text: `Gunakan tombol dibawah untuk menampilkan detail perintah per kategori` });

            categories.forEach(category => {
                const commandList = interaction.client.commands
                    .filter(cmd => cmd.category.toLowerCase() === category)
                    .map(
                        cmd => cmd.data.options.find(opt => opt.type === 1)
                        ? `${cmd.data.options
                            .filter(opt => opt.type === 1)
                            .map(
                                subCmd => `\`${cmd.data.name} ${subCmd.name}\``
                            ).join(", ")}`
                        : `\`${cmd.data.name}\``
                    );
                category = `${category.charAt(0).toUpperCase()}${category.slice(1)}`;
                embed.addFields(
                    { name: `Kategori ${category}`, value: commandList.join(", ") }
                )
                buttons.push(
                    new ButtonBuilder()
                        .setCustomId(category)
                        .setLabel(`Kategori ${category}`)
                        .setStyle(ButtonStyle.Primary)
                );
            });

            const action = new ActionRowBuilder().addComponents(...buttons);

            interaction.reply({ embeds: [embed], components: [action], fetchReply: true }).then(message => createButtonInteface(interaction, message, { buttons, embed, action, }));
            return;
        }
        else {
            const command = interaction.client.commands.get(query);
            if (!command) {
                embed.setColor(colors.error)
                embed.setDescription(`Oh! Aku tidak menemukan perintah \`${query}\``)
                interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }
            embed.setAuthor({ name: command.data.name })
                .setTitle(`Kategori: ${command.category}`)
                .setDescription(command.data.description);

            interaction.reply({ embeds: [embed] });
            return;
        }
    }
}

async function createButtonInteface(interaction, message, first) {
    const timeout = 1000 * 60 * 5;
    const filter = i => i.isButton() && i.user && i.message.author.id == interaction.client.user.id;
    const collector = await message.createMessageComponentCollector({ 
        filter,
        time: timeout,
    });

    var buttons = [
        new ButtonBuilder()
            .setCustomId("kembali")
            .setLabel("Kembali")
            .setStyle(ButtonStyle.Secondary),
        ...first.buttons,
    ];

    collector.on("collect", async i => {
        await i.deferUpdate();
        buttons = buttons.map(button => button.setDisabled(false));

        if (i.customId === "kembali") {
            await i.editReply({ embeds: [first.embed], components: [first.action] });
            return;
        }

        const commands = i.client.commands.filter(cmd => cmd.category === i.customId);
        if (commands.find(cmd => cmd.data.options.find(opt => opt.type === 1))) {
            commands.size = commands.filter(
                cmd => cmd.data.options.filter(opt => opt.type === 1)
            ).size;
        }
        const embed = new EmbedBuilder()
            .setColor(i.client.config.colors.default)
            .setTitle(`Kategori ${i.customId}`)
            .setDescription(
                commands.map(
                    cmd => cmd.data.options.find(opt => opt.type === 1)
                    ? `${cmd.data.options
                        .filter(opt => opt.type === 1)
                        .map(
                            subCmd => `\`${cmd.data.name} ${subCmd.name}\``
                        ).join("\n")}`
                    : `\`${cmd.data.name}\` > ${cmd.data.description}.`
                ).join("\n")
            )
            .setFooter({ text: `Tersedia ${commands.size} Perintah` });

        buttons = buttons.map(
            button => {
                if (button.data.custom_id === i.customId) button.setDisabled(true);
                return button;
            }
        );
        const action = new ActionRowBuilder().addComponents(...buttons);

        await i.editReply({ embeds: [embed], components: [action] });
        collector.resetTimer({ time: timeout });
    });

    collector.on("end", () => {
        if (!message) return;
        const buttons = first.buttons.map(button => button.setStyle(ButtonStyle.Secondary).setDisabled(true));
        const action = new ActionRowBuilder().addComponents(...buttons);

        message.edit({ embeds: [first.embed], components: [action] }).catch(o_O => void 0);
    });
}