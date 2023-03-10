import { Canvas, loadFont, loadImage } from "canvas-constructor/napi-rs";

export class RankCanvas {
    constructor() {
        this.data = {
            level: 1,
            xp: {
                current: 0,
                target: 512*3,
            },
            rank: 999,
        };
        this.profile = {
            avatar: "https://media.discordapp.net/attachments/1080473138342666381/1083619535187357776/ferna-t.png",
            username: "User",
            discriminator: "0000",
            bio: {
                title: "Aku adalah pemain Bot Ferna",
            },
        };
        this.options = {
            background: {
                style: "#23272A",
                layer: "#333640",
            },
            defaultColor: "white",
            border: {
                bgStyle: "#484b4E",
                style: "white",
                shadow: "white",
            },
        };
    }
    setData(data) {
        this.data = data;
        return this;
    }
    setLevel(data) {
        this.data.level = data;
        return this;
    }
    setRank(data) {
        this.data.rank = data;
        return this;
    }
    setXp(current, target) {
        if (current && target) {
            this.data.xp = { current, target };
        }
        else {
            this.data.xp = current
            ? { current, target: this.data.target }
            : { current: this.data.current, target };
        }
        return this;
    }
    setProfile(profile) {
        this.profile = profile;
        return this;
    }
    setAvatar(link) {
        this.profile.avatar = link;
        return this;
    }
    setUsername(name) {
        this.profile.username = name;
        return this;
    }
    setDiscriminator(randomInt) {
        this.profile.discriminator = randomInt;
        return this;
    }
    setBio(title, description) {
        this.profile.bio.title = title;
        return this;
    }
    setOptions(options) {
        this.options = options;
        return this;
    }
    setBackground(image, layer) {
        this.options.background.style = image;
        if (layer) this.options.background.layer = layer;
        return this;
    }
    setBorder(color, shadow) {
        this.options.border.style = color;
        if (shadow) this.options.border.shadow = shadow;
        return this;
    }
    setColor(code) {
        this.options.defaultColor = codeB
        return this;
    }
    async build() {

        //await loadFont(process.cwd()+"/assets/font/Roboto-Regular.ttf", "Roboto");
        await loadFont(process.cwd()+"/assets/font/NotoSans-Regular.ttf", "Noto");
        await loadFont(process.cwd()+"/assets/font/NotoColorEmoji-Reguler.ttf", "NotoEmoji");
        await loadFont(process.cwd()+"/assets/font/TiltWarp-Regular.ttf", "TiltWarp");
        await loadFont(process.cwd()+"/assets/font/TiltNeon-Regular.ttf", "TiltNeon");

        const avatar = await loadImage(this.profile.avatar);
        const username = this.profile.username.length > 13 ? `${this.profile.username.substr(0, 10)}...`: this.profile.username;
        const bio = this.profile.bio.title.length > 23 ? `${this.profile.bio.title.substr(0, 20)}...` : this.profile.bio.title;

        const width = 934;
        const height = 282;

        // creating canvas 2D
        const canvas = new Canvas(width, height)
        if (this.options.background.style.startsWith("http")) {
            // background image
            const bg = await loadImage(this.options.background.style);
            canvas.printImage(bg, 0, 0, width, height);
        }
        else {
            // background color
            canvas.setColor(this.options.background.style);
            canvas.printRectangle(0, 0, width, height);
        }

        // background layer
        canvas.setGlobalAlpha(0.5)
            .setColor(this.options.background.layer)
            .printRectangle(30, 30, width-60, height-60)
            .setGlobalAlpha(1)
            .printImage(avatar, 50 ,50, height-90, height-90)

            // border
            //.setShadowColor(this.options.border.shadow)
            //.setShadowBlur(2.5)
            .setStroke(this.options.border.style)
            .setStrokeWidth(10)
            .printStrokeRectangle(40, 40, height-80, height-80)
            //.resetShadows()

            // user tag
            .setColor(this.options.defaultColor)
            .setTextFont("50px TiltWarp, NotoEmoji")
            .printText(username, 280, 90)
            .process(canvas =>
                canvas.printText("#"+this.profile.discriminator, canvas.measureText(username).width + 280, 90)
            )

            // user bio title
            /*.setTextFont("35px TiltNeon,NotoEmoji")
            .printText(this.profile.bio.title, 280, 125)*/

            .process(canvas =>
                canvas.setTextFont("25px Noto")

                // Rank
                .printText("LEVEL", 280,210)
                .setTextFont("25px Noto")
                .printText(this.tls(this.data.level), canvas.measureText("LEVEL").width + 280 + 5, 210)

                // Level
                .setTextFont("35px Noto")
                .setTextAlign("right")
                .printText("RANK", 80, 90)
                .setTextFont("35px Noto")
                .printText("#"+this.tls(this.data.rank), canvas.measureText("RANK").width + 80, 90)

                // Xp
                .setTextAlign("right")
                .setTextFont("25px Noto")
                .printText("XP:", (width-54.5)-canvas.measureText(" "+this.tls(this.data.xp.current)+" / "+this.tls(this.data.xp.target)).width - 5, 210)
                .printText(this.tls(this.data.xp.current), (width-54.5)-canvas.measureText(" / "+this.tls(this.data.xp.target)).width - 5, 210)
                .printText("/", (width-54.5)-canvas.measureText(" "+this.tls(this.data.xp.target)).width - 5, 210)
                .printText(this.tls(this.data.xp.target), (width-54.5) - 5, 210)
            )

            // progress bar
            .setColor(this.options.border.bgStyle)
            .printRectangle(283,220, this._proW, 26)
            //.setShadowColor(this.options.border.shadow)
            //.setShadowBlur(2.5)
            .setColor(this.options.border.style)
            .printRectangle(283, 220, this._progressActive, 21)
            //.resetShadows()
            .setStroke(this.options.border.bgStyle)
            .setStrokeWidth(2)
            .printStrokeRectangle(283,220, this._proW, 26);

        return canvas.png();
    }
    tls(number) {
        return number.toLocaleString().replaceAll(",", ".");
    }
    get _proW() {
        return 590;
    }
    get _progressActive() {
        const cx = this.data.xp.current;
        const rx = this.data.xp.target;

        if (rx <= 0) return 1;
        if (cx > rx) return parseInt(this.proW) || 0;

        let width = (cx * 615) / rx;
        if (width > this.proW) width = this.proW;
        return parseInt(width) || 0;
    }
}