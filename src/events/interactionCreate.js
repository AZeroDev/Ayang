const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    execute: async(client, interaction) => {
        const embed = new EmbedBuilder().setColor(client.config.colors.error);

        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                embed.setDescription(`Perintah \`/${interaction.commandName}\` tidak dapat dijalankan.`);
                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }
            if (command.category === "Pengembang" && interaction.user.id !== process.env.DeveloperId) {
                embed.setDescription("Kamu tidak bisa memakai perintah ini!");
                interaction.reply({ embeds: [embed], ephemeral: true })
                return;
            }

            try {
                command.execute(interaction);
            } catch(error) {
                const txt = `Kesalahan saat menjalankan '${interaction.commandName}'`;
                embed.setTitle(txt);
                embed.setDescription(`Harap hubungi [developer](https://discord.com/users/${process.env.DeveloperId}) segera dan laporkan ini, terima kasih.`);
                console.log(txt, error);
                interaction.reply({ embeds: [embed], ephemeral: true }).catch(_ => void 0);
            }
        }
        else if (interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                embed.setDescription(`Perintah \`/${interaction.commandName}\` tidak dapat dijalankan.`);
                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }
            if (command.category === "Pengembang" && interaction.user.id !== process.env.DeveloperId) {
                embed.setDescription("Kamu tidak bisa memakai perintah ini!");
                interaction.reply({ embeds: [embed], ephemeral: true })
                return;
            }

            if (interaction.commandName === "help") {
                const commands = client.commands.filter(cmd => cmd.category !== "Pengembang");

                await interaction.respond(
                    commands.map(cmd => ({ name: cmd.data.name, value: cmd.data.name }))
                ).catch(o_O => void 0);
            }
        }

    }
}