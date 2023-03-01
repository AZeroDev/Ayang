const baseApi = process.env.BaseApiURL;

if (!baseApi) {
    console.error(
        new Error("Fungsi ini butuh Base API URL untuk dijalankan!")
    );
}

import { request } from "undici";

export const tebakLirik = async() => {
    const { statusCode, body } = await request(`${baseApi}/games/tebaklirik`).catch(console.error);
    if (statusCode === 200) return await body.json().catch(console.error);
};
