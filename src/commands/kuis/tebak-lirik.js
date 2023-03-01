import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { tebakLirik } from "../../functions/miniGame.js";

export default {
    data: new SlashCommandBuilder()
        .setName("tebak")
        .setDescription("Kuis tebak tebakan")
        .addSubcommand(subCommand =>
            subCommand.setName("lirik")
                .setDescription("Main kuis tebak tebakan lirik")
        ),
    category: "Kuis",
    execute: async(interaction) => {
        const { colors } = interaction.client.config;
        const embed = new EmbedBuilder().setColor(colors.default);

        const data = await tebakLirik();
        if (!data) {
            console.log("Data tidak tersedia!");
            return;
        }

        const waitMessage = await interaction.reply({
            content: `Kuis telah dimulai.\nSilahkan jawab potongan \`_____\` dari lirik berikut ini!\n(Waktu menjawab 5 menit dimulai dari sekarang...)\n\`\`\`txt\n${data.hasil.soal}\`\`\``,
            fetchReply: true,
        });

        const filter = (message) => {
            if (message.content.includes(data.hasil.jawaban)) return true;
            message.reply(`Maaf, jawaban ini salah!`).then(msg => setTimeout(() => msg.delete().catch(o_O => void 0), 5000));
            return false;
        };

        const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 1000*60*3 });

        collector.on("collect", (message) => {
            message.reply(`Selamat jawaban kamu benar.\nLirik sudah tersambung utuh!\n\`\`\`txt\n${data.hasil.soal.replace("_____", data.hasil.jawaban)}\`\`\``);
            waitMessage.reply(`Pemenangnya adalah **${message.author.tag}**`);
        });

        collector.on("end", (o_O) => void 0);
    }
}