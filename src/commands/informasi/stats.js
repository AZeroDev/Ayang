import { EmbedBuilder } from "discord.js";

const iStatus = {
    "online": "https://cdn.discordapp.com/emojis/689448141774389275.png",
    "idle": "https://cdn.discordapp.com/emojis/689448170307977240.png",
    "dnd": "https://cdn.discordapp.com/emojis/689448200406302765.png",
    "invisible": "https://cdn.discordapp.com/emojis/695461329800134696.png"
};

export default {
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Menampilkan informasi status"),
    category: "Informasi",
    execute: async(interaction) => {
        const waitnow = await Date.now();
        await interaction.deferReply();

        const { colors } = interaction.client.config;
        const embed = new EmbedBuilder()
            .setColor(colors.default)
            .setAuthor({ name: `Informasi Status`, iconURL: iStatus[interaction.client.presence.status] })
            .setDescription(`Sebuah bot lokal asli indonesia yang memiliki fitur global leveling, ranking, dan mini game`)
            .setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .addFields([
                { name: "ID Pengguna", value: interaction.client.user.id, inline: true },
                { name: "Telah Dibuat", value: `<t:${int(client.user.createdTimestamp)}:D>`, inline: true },
                { name: "Developer", value: `[${(await interaction.client.users.fetch(process.env.DeveloperId)).tag}](https://discord.com/users/${process.env.DeveloperId})`, inline: true }
            ])
            .addFields([
                { name: "Latensi", value: `Ping **${waitnow - interaction.createdTimestamp}** ms`, inline: true },
                { name: "Server", value: interaction.client.guilds.cache.size.toLocaleString().replaceAll(",", "."), inline: true },
                { name: "Pengguna", value: (interaction.client.guilds.cache.reduce((members, guild) => members + guild.memberCount, 0)).toLocaleString().replaceAll(",", "."), inline: true }
            ])
            .addFields({ name: "Waktu Aktif", value: `<t:${int(interaction.client.readyTimestamp)}> (<t:${int(interaction.client.readyTimestamp)}:R>)`})
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
}

function int(timestamp) {
    return Math.round(timestamp / 1000);
};