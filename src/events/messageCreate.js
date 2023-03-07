const { Events, EmbedBuilder } = require("discord.js");

const Level = require("../structures/Level.js");

module.exports = {
    name: Events.MessageCreate,
    execute: async(client, message) => {
        if (message.author.bot) return;

        const randomXp = Math.floor(Math.random() * 99) + 1;
        const levelUp = await Level.appendXp(message.author.id, "global", randomXp);
        if (levelUp) {
            const user = await Level.fetch(message.author.id, "global");
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.default)
                .setTitle("Level UP!")
                .setThumbnail(message.author.displayAvatarURL({ dynamic:true, size: 512 }))
                .setDescription(`Selamat! **${message.author.tag}** telah naik **level \`${user.level}\`**.`);
            message.channel.send({ embeds: [embed] });
        }
    }
}