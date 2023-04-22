import axios from 'axios';
import { Telegraf, Markup } from 'telegraf';

const bot = new Telegraf("1629285878:AAH9qWd9rRCdscXfXeSXsAa_57JV46JSwA8");
const baseURL = "https://api.ennead.cc/buruaka";

let skillsButton = [
    [
        Markup.button.callback("Lv1", "level-1"),
        Markup.button.callback("Lv2", "level-2"),
        Markup.button.callback("Lv3", "level-3"),
        Markup.button.callback("Lv4", "level-4"),
        Markup.button.callback("Lv5", "level-5"),
    ],
    [
        Markup.button.callback("Lv6", "level-6"),
        Markup.button.callback("Lv7", "level-7"),
        Markup.button.callback("Lv8", "level-8"),
        Markup.button.callback("Lv9", "level-9"),
        Markup.button.callback("Lv10", "level-10"),
    ],
    [
        Markup.button.callback("EX", "EX"),
        Markup.button.callback("Normal", "Normal"),
        Markup.button.callback("Passive", "Passive"),
        Markup.button.callback("Sub", "Sub")
    ],
    [
        Markup.button.callback("Back", "profile"),
    ]
]

function getStarEmoji(value) {
    let stars = '';
    for (let i = 0; i < value; i++) {
        stars += '⭐️';
    }
    return stars;
}

function getEmoji(value) {
    let result;
    switch (value) {
        case "Explosion":
            result = '🟥 Explosion';
            break;
        case "Penetration":
            result = '🟨 Penetration';
            break;
        case "Mystic":
            result = '🟦 Mystic';
            break;
        case "Light Armor":
            result = '❤️ Light Armor';
            break;
        case "Heavy Armor":
            result = '💛 Heavy Armor';
            break;
        case "Special Armor":
            result = '💙 Special Armor';
            break;
        case "Front":
            result = '➡️ Front';
            break;
        case "Middle":
            result = '⬇️ Middle';
            break;
        case "Back":
            result = '⬅️ Back';
            break;
        case "Attacker":
            result = '🎯 Attacker';
            break;
        case "Tanker":
            result = '🛡️ Tanker';
            break;
        case "Supporter":
            result = '🔧 Supporter';
            break;
        case "Healer":
            result = '🇨🇭 Healer';
            break;
    }
    return result;
}

async function getCharacter(name, skillsInput = "EX", toLevel = 1) {
    let filter = name.replace(/[()]/g, ''); // replace all parentheses with an empty string
    let capitalized = filter.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    let words = capitalized.split(' ');
    let parenthesed;
    if (words.length > 2) {
        parenthesed = words[0] + ' (' + words[1] + ' ' + words[words.length - 1] + ')'
    } else if (words.length === 2) {
        parenthesed = words[0] + ' (' + words[1] + ')'
    } else if (words.length === 1) {
        parenthesed = capitalized
    }

    // there's probably a bettter way to do this but, i'll do that later

    const dictOne = ["Kecil", "Kid", "Loli", "Bocil", "Small", "Shunny"];
    const dictOneFirstChange = " (Small)";
    const dictOneSecondChange = " (Kid)";
    const dictTwo = ['Sepeda', 'Cycling', 'Riding', 'Sports', 'Sportswear', 'Olahraga', 'Bike', 'Biking', 'Ride', 'Cycle'];
    const dictTwoFirstChange = " (Cycling)";
    const dictTwoSecondChange = " (Riding)";
    const dictThree = ['Bunny', 'Rabbit', 'Kelinci', 'Bunnies'];
    const dictThreeFirstChange = " (Bunny)";
    const dictThreeSecondChange = " (Bunny Girl)";

    for (let i = 0; i < words.length; i++) {
        if (dictOne.includes(words[i])) {
            parenthesed = words[0] + dictOneFirstChange;
        } else if (dictTwo.includes(words[i])) {
            parenthesed = words[0] + dictTwoFirstChange;
        } else if (dictThree.includes(words[i])) {
            parenthesed = words[0] + dictThreeFirstChange;
        }
    }

    try {
        let getData = await axios.get(baseURL + `/character/${parenthesed}`);
        let skills = skillsInput.toLowerCase();

        let basicInfo = getData['data']['character']
        let moreInfo = getData['data']['info']
        let profile = `${parenthesed}\nBase Star: ${getStarEmoji(basicInfo['baseStar'])}\nBullet Type: ${getEmoji(basicInfo['bulletType'])}\nArmor Type: ${getEmoji(basicInfo['armorType'])}\nPosition: ${getEmoji(basicInfo['position'])}\nRole: ${getEmoji(basicInfo['role'])}\nWeapon Type: ${basicInfo['weaponType']}\nSquad: ${basicInfo['squadType']}\n\nSchool: ${moreInfo['school']}\nAge: ${moreInfo['age']}\nSchool Year: ${moreInfo['schoolYear']}\nVoice Actor: ${moreInfo['voiceActor']}\n`

        let statsInfo = getData['data']['stat'];
        let terrainInfo = getData['data']['terrain'];
        let terrainText = `${parenthesed}\n\n🏙️ City Area: ${statsInfo['streetMood']}\n🎯 Damage Dealt: ${terrainInfo['urban']['DamageDealt']}\n🛡️ Shied Block Rate: ${terrainInfo['urban']['ShieldBlockRate']}\n\n🏜️ Desert Area: ${statsInfo['outdoorMood']}\n🎯 Damage Dealt: ${terrainInfo['outdoor']['DamageDealt']}\n🛡️ Shied Block Rate: ${terrainInfo['outdoor']['ShieldBlockRate']}\n\n🏠 Indoor Area: ${statsInfo['indoorMood']}\n🎯 Damage Dealt: ${terrainInfo['indoor']['DamageDealt']}\n🛡️ Shied Block Rate: ${terrainInfo['indoor']['ShieldBlockRate']}`

        let skillsInfo = getData['data']['skills'];
        let skillsText = `${parenthesed}\n\n${skillsInput} Skills: ${skillsInfo[skills][toLevel - 1]['name']}\nLevel: ${skillsInfo[skills][toLevel - 1]['level']} | Costs: ${skillsInfo[skills][toLevel - 1]['skillCost']}\n\n${skillsInfo[skills][toLevel - 1]['description']}`
        
        for (let i = 0; i < words.length; i++) {
            if (dictOne.includes(words[i])) {
                parenthesed = words[0] + dictOneSecondChange
            } else if (dictTwo.includes(words[i])) {
                parenthesed = words[0] + dictTwoSecondChange
            } else if (dictThree.includes(words[i])) {
                parenthesed = words[0] + dictThreeSecondChange
            }
        }

        let getImage = await axios.get(`https://api-blue-archive.vercel.app/api/characters?name=${words[0]}`);
        let getOrder = 0;
        for (let i = 0; i < getImage.data.data.length; i++) {
            if (getImage.data.data[i].name === parenthesed) {
                getOrder = i;
                break;
            }
        }
        let image = getImage.data.data[getOrder].photoUrl;
        return { profile: profile, image: image, terrain: terrainText, skills: skillsText };
    } catch (err) {
        return { profile: "Error" };
    }
}

async function getBanner(status = "current") {
    let getData = await axios.get(baseURL + `/banner`);
    let bannerData = getData.data[status];
    let Banner = status === "current" ? bannerData : bannerData.slice(-5);

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    let res = status === "current" ? "Currently Active Banner\n\n" : "Last Ended Banner\n\n"
    Banner.forEach(e => {
        let rateups = "";
        let startDate = new Date(e.startAt);
        let startAt = startDate.toLocaleDateString('id-ID', options);
        let endDate = new Date(e.endAt);
        let endAt = endDate.toLocaleDateString('id-ID', options);
        e.rateups.forEach(e => {
            rateups = rateups + e + ' ';
        })
        res += `🔺 Rate Up: ${rateups}\n📅 Duration: ${startAt} - ${endAt}\n\n`
    });
    return res;
}

async function getRaid(status = "current") {
    let getData = await axios.get(baseURL + `/raid`);
    let bannerData = getData.data[status];
    let Banner = status === "ended" ? bannerData.slice(-3) : bannerData;

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    let res;

    if (Banner.length === 0) return res = `There's no active raid\n`

    if (status === "current") res = "Currently Active Raid\n\n";
    if (status === "upcoming") res = "Upcoming Active Raid\n\n";
    if (status === "ended") res = "Last Ended Raid\n\n";

    Banner.forEach(e => {
        let rateups = e.bossName;
        let startDate = new Date(e.startAt);
        let startAt = startDate.toLocaleDateString('id-ID', options);
        let endDate = new Date(e.endAt);
        let endAt = endDate.toLocaleDateString('id-ID', options);
        res += `📛 Boss Name: ${rateups}\n📅 Duration: ${startAt} - ${endAt}\n\n`
    });
    return res;
}

bot.command('start', async (ctx) => {
    ctx.reply(`Hello, here's some command list, more will added overtime (hopefully)\n• /character - search character details\n• /raid - check active, upcoming and past raid\n• /banner - check active and past banner\n`)
})

bot.command(['character', 'ch', 'student', 'st'], async (ctx) => {
    const getNames = ctx.update.message.text;
    const names = getNames.split(' ');
    if (names.length === 1) {
        await ctx.reply(`
        Search specific character by Name\n\nExample: \n/character hoshino\n/character hina (swimsuit)\n/character mutsuki (new year)\n\nalternative command: /ch /st /student
        `);
        return;
    }
    const name = names.slice(1).join(' ');

    let data = await getCharacter(name);

    if (data.profile === "Error") {
        await ctx.reply("Character Not Found!");
    } else {
        await ctx.replyWithPhoto(data.image, {
            caption: data.profile,
            ...Markup.inlineKeyboard([
                Markup.button.callback("Terrain", "terrain"),
                Markup.button.callback("Skills", "skills"),
            ])
        });
    }
})

bot.action("profile", async (ctx) => {
    let getNames = ctx.update.callback_query.message.caption;
    let index = getNames.indexOf('\n');
    let words = getNames.slice(0, index);
    let data = await getCharacter(words);

    ctx.editMessageCaption(
        data.profile,
        {
            ...Markup.inlineKeyboard([
                Markup.button.callback("Terrain", "terrain"),
                Markup.button.callback("Skills", "skills"),
            ])
        }
    ).catch(() => { });
}
);

bot.action("terrain", async (ctx) => {
    let getNames = ctx.update.callback_query.message.caption;
    let index = getNames.indexOf('\n');
    let words = getNames.slice(0, index);
    let data = await getCharacter(words);
    ctx.editMessageCaption(
        data.terrain,
        {
            ...Markup.inlineKeyboard([
                Markup.button.callback("Profile", "profile"),
                Markup.button.callback("Skills", "skills"),
            ])
        }
    ).catch(() => { });
}
);

bot.action("skills", async (ctx) => {
    let getNames = ctx.update.callback_query.message.caption;
    let index = getNames.indexOf('\n');
    let words = getNames.slice(0, index);
    let data = await getCharacter(words);

    ctx.editMessageCaption(
        data.skills,
        {
            ...Markup.inlineKeyboard(skillsButton)
        }
    ).catch(() => { });
}
);

bot.action(/level/, async (ctx) => {
    let getNames = ctx.update.callback_query.message.caption;
    let index = getNames.indexOf('\n');
    let name = getNames.slice(0, index);

    let getSkills = ctx.update.callback_query.message.caption.split('\n');
    let skills = getSkills[2].split(' ')[0]

    let getLevel = ctx.update.callback_query.message.caption;
    let levelMatch = getLevel.match(/Level:\s*(\d+)/);
    let level = levelMatch ? levelMatch[1] : null;

    let getToLevel = ctx.match["input"];
    const toLevel = getToLevel.match(/\d+/)[0];

    let data = await getCharacter(name, skills, toLevel);

    ctx.editMessageCaption(
        data.skills,
        {
            ...Markup.inlineKeyboard(skillsButton)
        }
    ).catch(() => { });
}
);

bot.action(["Normal", "Passive", "Sub", "EX"], async (ctx) => {
    let getNames = ctx.update.callback_query.message.caption;
    let index = getNames.indexOf('\n');
    let name = getNames.slice(0, index);
    let skills = ctx.match["input"];
    let data = await getCharacter(name, skills);

    ctx.editMessageCaption(
        data.skills,
        {
            ...Markup.inlineKeyboard(skillsButton)
        }
    ).catch(() => { });
}
)

bot.command('banner', async (ctx) => {
    let data = await getBanner();

    await ctx.reply(data, {
        ...Markup.inlineKeyboard([
            Markup.button.callback("Active Banner", "current"),
            Markup.button.callback("Past Banner", "ended")
        ])
    }
    ).catch(() => { });
})

bot.action(["current", "ended"], async (ctx) => {
    let data = await getBanner(ctx.match[0]);
    ctx.editMessageText(
        data, {
        ...Markup.inlineKeyboard([
            Markup.button.callback("Active Banner", "current"),
            Markup.button.callback("Past Banner", "ended")
        ])
    }
    ).catch(() => { });
})

bot.action(["current-raid", "ended-raid", "upcoming-raid"], async (ctx) => {
    let trimmedWord = ctx.match[0].slice(0, -5);
    let data = await getRaid(trimmedWord);
    ctx.editMessageText(
        data, {
        ...Markup.inlineKeyboard([
            Markup.button.callback("Active", "current-raid"),
            Markup.button.callback("Upcoming", "upcoming-raid"),
            Markup.button.callback("Past", "ended-raid")
        ])
    }
    ).catch(() => { });
})

bot.command('raid', async (ctx) => {
    let data = await getRaid();

    await ctx.reply(data, {
        ...Markup.inlineKeyboard([
            Markup.button.callback("Active", "current-raid"),
            Markup.button.callback("Upcoming", "upcoming-raid"),
            Markup.button.callback("Past", "ended-raid")
        ])
    }
    ).catch(() => { });
})



bot.launch();