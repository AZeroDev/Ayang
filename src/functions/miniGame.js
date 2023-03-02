const baseApi = process.env.BaseApiURL;

if (!baseApi) {
    console.error(
        new Error("Fungsi ini butuh Base API URL untuk dijalankan!")
    );
}

import { EmbedBuilder } from "discord.js";
import { request } from "undici";

export const standar = async(interaction, key) => {
    let timeout = 30;
    let userFollowed = [];

    const { colors } = interaction.client.config;
    const embed = new EmbedBuilder().setColor(colors.default);

    try {
        const { body, statusCode } = await request(`${baseApi}/games/${key.replace("-", "")}`).catch(console.error);
        const data = await body.json().catch(o_O => void 0);

        if (!data || statusCode !== 200) return interaction.reply({ content: "Fungsi perintah ini sedang tidak aktif sementara! Tolong hubungi developer untuk info lebih lanjut.", ephemeral: true });

        embed.setTitle("Pertanyaan:")
            .setDescription(data.hasil.soal)
            .setFooter({ text: `Waktu menjawab pertanyaan adalah ${timeout} detik` });
        if (key === "susun-kata") {
                embed.setDescription(`Susun Kata berikut ini menjadi sebuah kalimat yang benar!\`\`\`txt\n${embed.data.description}\`\`\`\n\nTipe: **${data.hasil.tipe}**`)
        }

        await interaction.reply({ content: "Silahkan jawab pertanyaan berikut ini!", embeds: [embed] });
        const message = await interaction.fetchReply();

        const filter = (respon) => {
            if (!respon.author.bot && !userFollowed.find(user => user === respon.author)) {
                userFollowed.push(respon.author);
            }
            return data.hasil.jawaban.toLowerCase() === respon.content.toLowerCase();
        }
        interaction.channel.awaitMessages({ filter, time: 1000 * timeout, max: 1 }).then(collect => {
            collect = collect.first();
            collect.react("✅");

            embed.setAuthor({ name: collect.author.tag, iconURL: collect.author.displayAvatarURL({ dynamic: true }) })
                .setTitle("Selamat!")
                .setDescription(`${userFollowed.length > 1 ? `Pemenangnya adalah ${collect.author}\n\n` : ''}Telah berhasil menjawab pertanyaan: **${data.hasil.soal}**`)
                .setFooter({ text: `Jawaban: ${data.hasil.jawaban}` });
            if (key === "susun-kata") {
                embed.setDescription(`${userFollowed.length > 1 ? `Pemenangnya adalah ${collect.author}\n\n` : ''}Telah berhasil menyusun kata: **${data.hasil.soal}**`);
            }
            if (key === "cak-lontong") {
                embed.setFooter({ text: `${embed.data.footer.text} | ${data.hasil.deskripsi}`})
            }
            collect.reply({ embeds: [embed] });
        }).catch(() => {
            embed.setColor(colors.error)
                .setTitle("Waktu Telah Habis")
                .setDescription("Hmm... Tidak ada yang bisa menjawab?")
                .setFooter({ text: `Jawabannya adalah ${data.hasil.jawaban}` });
            if (key === "cak-lontong") {
                embed.setFooter({ text: `${embed.data.footer.text} | ${data.hasil.deskripsi}`})
            }
            message.reply({ embeds: [embed] });
        })
    }
    catch(error) {
        console.error(error);
        interaction.reply({ content: "Fungsi perintah ini sedang tidak aktif sementara! Ada kesalahan teknis.", ephemeral: true });
        return;
    }
}

export const family100 = async(interaction) => {
    await interaction.reply({ content: "Family 100", ephemeral: true });
}

export const tebakGambar = async(interaction) => {
    await interaction.reply({ content: "Tebak Gambar", ephemeral: true });
};

export const tebakKalimat = async(interaction) => {
    await interaction.reply({ content: "Tebak Kalimat", ephemeral: true });
};

export const tebakKata = async(interaction) => {
    await interaction.reply({ content: "Tebak Kata", ephemeral: true });
};

export const tebakLirik = async(interaction) => {
    await interaction.reply({ content: "Tebak Lirik", ephemeral: true });
};

export const tebakTebakan = async(interaction) => {
    await interaction.reply({ content: "Tebak Tebakan", ephemeral: true });
};
