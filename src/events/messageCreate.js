import { Events, EmbedBuilder } from "discord.js";

import Level from "../structures/Level.js";

export default{
    name: Events.MessageCreate,
    execute: async(client, message) => {
        if (message.author.bot) return;

        const randomXp = Math.floor(Math.random() * 29) + 1;
        const levelUp = await Level.appendXp(message.author.id, "global", randomXp);
        if (levelUp) {
            const user = await Level.fetch(message.author.id, "global");
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.default)
                .setTitle("Level UP!")
                .setThumbnail(message.author.displayAvatarURL({ dynamic:true, size: 512 }))
                .setDescription(`Selamat! **${message.author.tag}*** telah naik **level \`${user.level}\`**.`);
            message.channel.send({ embeds: [embed] });
        }
    }
}