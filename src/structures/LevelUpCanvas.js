import { Canvas, loadFont, loadImage } from "canvas-constructor";

export class LevelUpCard {
    constructor() {
        this.data = {
            level: 0,
        };
        this.options = {
            background: {
                style: "https://media.discordapp.net/attachments/1080473138342666381/1083734819978100757/112.png.jpg",
                layer: "#333640",
            },
            defaultColor: "white",
            border: {
                bgStyle: "#484b4E",
                style: "white",
                shadow: "white",
            },
        }
    }
}