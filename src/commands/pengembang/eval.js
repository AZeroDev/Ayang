import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

import { inspect } from "node:util";

export default {
    data: new SlashCommandBuilder()
        .setName("eval")
        .setDescription("Evaluasi kode pemrograman")
        .addStringOption(option => 
            option.setName("kode-program")
                .setDescription("Sebuah kode pemrograman basis JavaScript")
                .setRequired(true)
        ),
    category: "Pengembang",
    execute: async(interaction) => {
        const { colors } = interaction.client.config;
        const code = interaction.options.getString("kode-program");
        const embed = new EmbedBuilder().setColor(colors.default);

        await interaction.deferReply();

        try {
            let evaled = await eval(code);
                evaled = clean(evaled);

            embed.setTitle("Respon Hasil")
            embed.setDescription(`\`\`\`js\n${evaled}\`\`\``);

            await interaction.editReply({ embeds: [embed] });
        }
        catch(error) {
            embed.setColor(colors.error);
            embed.setTitle("Respon Error!")
            embed.setDescription(`\`\`\`js\n${clean(error)}\`\`\``);

            await interaction.editReply({ embeds: [embed] })
        }
    }
}

function clean(code) {
    if  (typeof code === "string") {
        return code
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203));
    }
    else {
        return inspect(code, { depth: 0 });
    }
};