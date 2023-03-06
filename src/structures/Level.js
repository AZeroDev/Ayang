import leveling from "../models/Leveling.js";

const defaultXp = 456;

class FernaLeveling {
    constructor() { 
        throw new TypeError(`${this.constructor.name} is 'static' constructor, cannot invoked by 'new' !`);
    }

    /**
    * @param {string} [userId] - Discord user id.
    * @param {string} [guildId] - Discord guild id.
    */

    static async createUser(userId, guildId) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");

        const isUser = await leveling.findOne({ userId, guildId });
        if (isUser) return false;

        const newUser = new leveling({
            userId,
            guildId
        });

        await newUser.save().catch(e => console.log(`Failed to create user: ${e}`));

        return newUser;
    }

    /**
    * @param {string} [guildId] - Discord guild id.
    */

    static async deleteGuild(guildId) {
        if (!guildId) throw new TypeError("A guild id was not provided.");

        const guild = await leveling.findOne({ guildId });
        if (!guild) return false;

        await leveling.deleteMany({ guildId }).catch(e => console.log(`Failed to delete guild: ${e}`));

        return guild;
    }

    /**
    * @param {string} [userId] - Discord user id.
    * @param {string} [guildId] - Discord guild id.
    */

    static async deleteUser(userId, guildId) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");

        const user = await leveling.findOne({ userId, guildId });
        if (!user) return false;

        await leveling.findOneAndDelete({ userId, guildId }).catch(e => console.log(`Failed to delete user: ${e}`));

        return user;
    }

    /**
    * @param {string} [userId] - Discord user id.
    * @param {string} [guildId] - Discord guild id.
    * @param {number} [xp] - Amount of xp to append.
    */

    static async appendXp(userId, guildId, xp) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (xp <= 0 || !xp || isNaN(parseInt(xp))) throw new TypeError("An amount of xp was not provided/was invalid.");

        const user = await leveling.findOne({ userId, guildId });

        if (!user) {
            const newUser = new leveling({
                userId,
                guildId,
                xp,
                dailyXp: xp,
                level: Math.floor(0.1 * Math.sqrt(xp))
            });

            await newUser.save().catch(e => console.log(`Failed to save new user.`));

            return (Math.floor(0.1 * Math.sqrt(xp)) > 0);
        };

        if (user.dailyXp <= user.dailyXpLimit) {
            user.xp += parseInt(xp, 10);
            user.dailyXp = user.xp;
            user.level = Math.floor(0.1 * Math.sqrt(user.xp));
            user.lastUpdated = new Date();
 
            await user.save().catch(e => console.log(`Failed to append xp: ${e}`) );
        }

        return (Math.floor(0.1 * Math.sqrt(user.xp -= xp)) < user.level);
    }

    /**
    * @param {string} [userId] - Discord user id.
    * @param {string} [guildId] - Discord guild id.
    * @param {number} [leveling] - Amount of leveling to append.
    */

    static async appendLevel(userId, guildId, levelings) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (!levelings) throw new TypeError("An amount of leveling was not provided.");

        const user = await leveling.findOne({ userId, guildId });
        if (!user) return false;
        
        if (user.dailyXp <= user.dailyXpLimit) {
        user.level += parseInt(levelings, 10);
        user.xp = user.level * user.level * defaultXp;
        user.dailyXp = user.xp;
        user.lastUpdated = new Date();
 
        user.save().catch(e => console.log(`Failed to append level: ${e}`) );
        };

        return user;
    }

    /**
    * @param {string} [userId] - Discord user id.
    * @param {string} [guildId] - Discord guild id.
    * @param {number} [xp] - Amount of xp to set.
    */

    static async setXp(userId, guildId, xp) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (xp <= 0 || !xp || isNaN(parseInt(xp))) throw new TypeError("An amount of xp was not provided/was invalid.");

        const user = await leveling.findOne({ userId, guildId });
        if (!user) return false;

        if (user.dailyXp <= user.dailyXpLimit){
        user.xp = xp;
        user.dailyXp = user.xp;
        user.level = Math.floor(0.1 * Math.sqrt(user.xp));
        user.lastUpdated = new Date();
    
        user.save().catch(e => console.log(`Failed to set xp: ${e}`) );
        }

        return user;
    }

    /**
    * @param {string} [userId] - Discord user id.
    * @param {string} [guildId] - Discord guild id.
    * @param {number} [level] - A level to set.
    */

    static async setLevel(userId, guildId, level) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (!level) throw new TypeError("A level was not provided.");

        const user = await leveling.findOne({ userId, guildId });
        if (!user) return false;

        if (user.dailyXp <= user.dailyXpLimit) {
        const oldLevel = user.level;
        user.level = level;
        user.xp = level * level * defaultXp;
        user.dailyXp = user.xp;
        user.lastUpdated = new Date();
        
        user.save().catch(e => console.log(`Failed to set level: ${e}`) );
        };

        return user;
    }

    /**
    * @param {string} [userId] - Discord user id.
    * @param {string} [guildId] - Discord guild id.
    */

    static async fetch(userId, guildId, fetchPosition = false) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");

        const user = await leveling.findOne({
            userId,
            guildId
        });
        if (!user) return false;

        if (fetchPosition === true) {
            const leaderboard = await leveling.find({
                guildId
            }).sort([['xp', 'descending']]).exec();

            user.position = leaderboard.findIndex(i => i.userId === userId) + 1;
        }

        user.cleanXp = user.xp - this.xpFor(user.level);
        user.cleanNextLevelXp = this.xpFor(user.level + 1) - this.xpFor(user.level);
        
        return user;
    }

    /**
    * @param {string} [userId] - Discord user id.
    * @param {string} [guildId] - Discord guild id.
    * @param {number} [xp] - Amount of xp to subtract.
    */

    static async subtractXp(userId, guildId, xp) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (xp <= 0 || !xp || isNaN(parseInt(xp))) throw new TypeError("An amount of xp was not provided/was invalid.");

        const user = await leveling.findOne({ userId, guildId });
        if (!user) return false;

        user.xp -= xp;
        user.dailyXp = user.xp;
        user.level = Math.floor(0.1 * Math.sqrt(user.xp));
        user.lastUpdated = new Date();
     
        user.save().catch(e => console.log(`Failed to subtract xp: ${e}`) );

        return user;
    }

    /**
    * @param {string} [userId] - Discord user id.
    * @param {string} [guildId] - Discord guild id.
    * @param {number} [leveling] - Amount of leveling to subtract.
    */

    static async subtractLevel(userId, guildId, levelings) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (!levelings) throw new TypeError("An amount of leveling was not provided.");

        const user = await leveling.findOne({ userId, guildId });
        if (!user) return false;

        user.level -= levelings;
        user.xp = user.level * user.level * defaultXp;
        user.lastUpdated = new Date();
        
        user.save().catch(e => console.log(`Failed to subtract leveling: ${e}`) );

        return user;
    }

    /**
    * @param {string} [guildId] - Discord guild id.
    * @param {number} [limit] - Amount of maximum enteries to return.
    */


    static async fetchLeaderboard(guildId, limit) {
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (!limit) throw new TypeError("A limit was not provided.");

        const users = await leveling.find({ guildId }).sort([['xp', 'descending']]).limit(limit).exec();

        return users;
    }

    /**
    * @param {string} [client] - Your Discord.CLient.
    * @param {array} [leaderboard] - The output from 'fetchLeaderboard' function.
    */

    static async computeLeaderboard(client, leaderboard, fetchUsers = false) {
        if (!client) throw new TypeError("A client was not provided.");
        if (!leaderboard) throw new TypeError("A leaderboard id was not provided.");

        if (leaderboard.length < 1) return [];

        const computedArray = [];

        if (fetchUsers) {
            for (const key of leaderboard) {
                const user = await client.users.fetch(key.userId) || { username: "Unknown", discriminator: "0000" };
                computedArray.push({
                    guildId: key.guildId,
                    userId: key.userId,
                    xp: key.xp,
                    level: key.level,
                    position: (leaderboard.findIndex(i => i.guildId === key.guildId && i.userId === key.userId) + 1),
                    username: user.username,
                    discriminator: user.discriminator
                });
            }
        } else {
            leaderboard.map(key => computedArray.push({
                guildId: key.guildId,
                userId: key.userId,
                xp: key.xp,
                level: key.level,
                position: (leaderboard.findIndex(i => i.guildId === key.guildId && i.userId === key.userId) + 1),
                username: client.users.cache.get(key.userId) ? client.users.cache.get(key.userId).username : "Unknown",
                discriminator: client.users.cache.get(key.userId) ? client.users.cache.get(key.userId).discriminator : "0000"
            }));
        }

        return computedArray;
    }
    
    /*
    * @param {number} [targetLevel] - Xp required to reach that level.
    */
    static xpFor(targetLevel) {
        if (isNaN(targetLevel) || isNaN(parseInt(targetLevel, 10))) throw new TypeError("Target level should be a valid number.");
        if (isNaN(targetLevel)) targetLevel = parseInt(targetLevel, 10);
        if (targetLevel < 0) throw new RangeError("Target level should be a positive number.");
        return targetLevel * validate(targetLevel) * defaultXp;
    }
}

export default FernaLeveling;

function validate(level) {
    if (level <= 10) return 3;
    if (level <= 30) return 4;
    if (level <= 50) return 5;
    if (level <= 60) return 6;
    if (level <= 70) return 7;
    if (level <= 80) return 8;
    if (level <= 90) return 9;
    if (level <= 100) return 10;

    return 11;
};
