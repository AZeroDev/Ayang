import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

import level from "../../structures/Level.js";

export default {
    data: new SlashCommandBuilder()
        .setName("top")
        .setDescription("Menampilkan peringkat pemain papan atas (global / server)")
        .addSubcommand(subCommandOption =>
            subCommandOption.setName("global")
            .setDescription("Menampilkan 10 peringkat pemain papan atas global")
        )
        .addSubcommand(subCommandOption =>
            subCommandOption.setName("server")
            .setDescription("Menampilkan 10 peringkat pemain papan atas di server ini")
        ),
    category: "Leveling",
    execute: async(interaction) => {
        await interaction.deferReply();
        const chosen = interaction.options.getSubcommand();

        if (chosen === "global") {
            sendTopGlobal(interaction);
        }
        else if (chosen === "server") {
            sendTopServer(interaction);
        }
    }
};

async function sendTopGlobal(interaction) {
    const raw = await level.fetchLeaderboard("global", 10);
    if (raw.length < 1) {
        await interaction.editReply("Tampaknya belum ada rank pemain top 10 besar!")
    }
    const data = await level.computeLeaderboard(interaction.client, raw, true);

    const embed = new EmbedBuilder()
        .setColor(interaction.client.config.colors.default)
        .setTitle("Peringkat Global - Top 10 besar leveling")
        .setDescription("```\nmd"+data.map(e => `# ${e.position}. ${e.username}#${e.discriminator}\nLevel: ${e.level}\nXP: ${e.xp.toLocaleString().replaceAll(",",".")}`).join("\n")+"```");

    await interaction.editReply({ embeds: [embed] });
}

async function sendTopServer(interaction) {
    await interaction.editReply({ content: "Cooming soon!", ephemeral: true, });
}