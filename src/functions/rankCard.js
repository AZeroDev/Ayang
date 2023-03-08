import { Canvas, loadFont, loadImage } from "canvas-constructor/napi-rs";

export async function create(interaction) {
    if (!interaction || typeof interaction !== "object") throw new Error("at here!");

    var msg;
    if (!interaction.deferred) {
        await interaction.deferReply();
    }
    else {
        msg = await interaction.channel.send("Sedang proses membuat Kartu Rank...");
    }

    const user = interaction.user;
    const data = {};

    await loadFont(process.cwd()+"/assets/font/Roboto-Regular.ttf", "Roboto");
    await loadFont(process.cwd()+"/assets/font/NotoSans-Regular.ttf", "Noto");
    await loadFont(process.cwd()+"/assets/font/TiltWarp-Regular.ttf", "TiltWarp");
    await loadFont(process.cwd()+"/assets/font/TiltNeon-Regular.ttf", "TiltNeon");
    
    const avatar = await loadImage(user.displayAvatarURL({ dynamic: true, size: 1024, format: "png" }));
    const username = user.username.length > 13 ? `${user.username.substr(0, 10)}...`: user.username;

    const profile = {
        title: "Ferna Bot Developer",
        level: 23,
        rank: 12,
        xp: {
            current: 1024,
            target: 2048,
        },
    };

    const width = 934;
    const height = 282;

    const canvas = new Canvas(width, height)
        .setColor("#23272A")
        .printRectangle(0,0, width, height)
        .setGlobalAlpha(0.5)
        .setColor("#333640")
        .printRectangle(30,30, width-60, height-60)
        .setGlobalAlpha(1)
        .printImage(avatar, 40,40, height-80, height-80)
        .setStroke("#BCC0C0")
        .setStrokeWidth(10)
        .printStrokeRectangle(35,35, height-70, height-70)
        .setColor("white")
        .setTextFont("50px TiltWarp")
        .printText(username, 280, 90)
        .process(canvas =>
            canvas.setTextFont("50px TiltWarp")
            .printText("#"+user.discriminator, canvas.measureText(username).width + 280, 90)
        )
        .setTextFont("35px TiltNeon")
        .printText(profile.title, 280, 130)
        .process(canvas =>
            // One Line
            canvas.setTextFont("25px Noto")

            // Rank
            .printText("RANK", 280,210)
            .printText("#"+profile.rank, canvas.measureText("RANK").width + 280 + 5, 210)

            // Level
            .printText("LEVEL", canvas.measureText("RANK #"+profile.rank).width + 280 + 20, 210)
            .printText(profile.level.toString(), canvas.measureText(`RANK #${profile.rank} LEVEL`).width + 280 + 20, 210)

            // Xp
            .printText("XP:", width/1.5, 210)
            .printText(profile.xp.current.toString(), canvas.measureText("XP:").width + width/1.5 + 5, 210)
            .printText("/", canvas.measureText("XP: "+profile.xp.current).width + width/1.5 + 5, 210)
            .printText(profile.xp.target.toString(), canvas.measureText("XP: "+profile.xp.current+" /").width + width/1.5 + 5, 210)
        )
        .setColor("#BCC0C0")
        .printRectangle(282, 220, 295, 10)
        .setStroke("white")
        .setStrokeWidth(1)
        .printStrokeRectangle(282,220, 590,10)
        .png();

    await interaction.channel.send({
        files: [
            { attachment: canvas, name: `${user.tag}-card.png` }
        ]
    });
    if (msg) msg.delete().catch(_ => void 0);
}