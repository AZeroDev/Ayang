import { SlashCommandBuilder } from "discord.js";
import { RankCardBuilder } from "discord-card-canvas";

import level from "../../structures/Level.js";

const assets = {
    bg: "#84ADEF",
    bgLink: "https://media.discordapp.net/attachments/1080473138342666381/1083734819978100757/112.png.jpg",
};

export default {
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Menampilkan kartu rank leveling")
        .addUserOption(option =>
            option.setName("pemain")
            .setDescription("Pilih seseorang untuk menampilkan kartu rank nya")
        ),
    category: "Leveling",
    execute: async(interaction) => {
        await interaction.reply("_Sedang memproses kartu rank..._");

        const user = interaction.options.getUser("pemain") || interaction.user;
        if (user.bot) {
            await interaction.editReply({ content: '', embeds: [{ color: 0xff0000, description: "Bot tidak mempunyai kartu rank!" }] });
            return;
        };

        user.avatarLink = user.displayAvatarURL({ dynamic: true, size: 1024, format: "png" });
        if (!user.avatarLink) user.avatarLink = user.defaultAvatarURL;
        else user.avatarLink = user.avatarLink.replace(".webp", ".png")

        const data = await level.fetch(user.id, "global", true);
        if (!data) {
            await interaction.editReply({ content: '', embeds: [{ color: 0xff0000, description: "Tampaknya pemain ini belum terdaftar." }] });
            return;
        }

        const member = await interaction.guild.members.fetch({ user, withPresences: true });

        const card = await new RankCardBuilder({
            userStatus: member.presence.status,
            colorTextDefault: "white",
            progressBarColor: "white",
            currentXPColor: "white",
            requiredXPColor: "white",
        })
            .setFontDefault("Inter")
            .setNicknameText({ content: user.tag })
            .setAvatarImgURL(user.avatarLink)
            .setBackgroundImgURL(assets.bgLink)
            .setAvatarBackgroundEnable(false)
            .setCurrentLvl(data.level)
            .setCurrentRank(data.position)
            .setCurrentXP(data.xp)
            .setRequiredXP(level.xpFor(data.level))
            .build();

        await interaction.editReply({ content: '', files: [{ attachment: await card.toBuffer(), name: `${user.tag}_rank-card.png` }] });
    }
}