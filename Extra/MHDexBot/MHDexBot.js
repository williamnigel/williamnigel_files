//DexBot created by kenken and Willy
const Discord = require("discord.js")
const dirdata = require('./database/weakness.json')
require("dotenv").config()

const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MEMBERS"
    ]
})

let bot = {
    client,
    prefix: ["!d", "!h"],
    prefix_c: ["#BECA60", "#BECA60"],
    owners:["582621515854381066"]
}

function generate_embed(datasrc, color){
    const imglist = ['hitbox', 'hitbox2', 'hitbox3', 'hitbox4', 'hitbox5', 'hitbox6', 'hitbox7', 'hitbox8', 'hitbox9', 'hitbox10'];
    const srclist = ['source', 'source2', 'source3', 'source4', 'source5', 'source6', 'source7', 'source8', 'source9', 'source10'];
    var emb_list = [];
    for (var i = 0; i < 10; i++) {
        if(datasrc[imglist[i]] === undefined || datasrc[srclist[i]] === undefined) continue;
        var emb = new Discord.MessageEmbed().setTitle(datasrc.embed)
            .setImage(datasrc[imglist[i]])
            .setColor(color)
            .setFooter({ text: datasrc[srclist[i]] });
        emb_list.push(emb);
    }
    return emb_list;
}

function regexpattern(msg, pattern){
    var regex = new RegExp(pattern);
    var this_match = msg.match(regex);
    return (this_match !== null && Array.isArray(this_match) && this_match[1] ? this_match : false);
}

client.on('ready', () => {
    client.on("messageCreate", (message) => { // Message function
        if(message.author.bot) return; // stop process if msg is send by bot

        let msg = message.content;
        msg = msg.toLowerCase();
        let match_pattern = regexpattern(msg, '(^' + bot.prefix.join("|^") + ')');
        let run_prefix = (match_pattern ? match_pattern[1] : '');
        let gamekeylist = Object.keys(dirdata);

        // When user type !d
        if(run_prefix === bot.prefix[0]){
            // Write the pattern and put into Regex make regex check these string is match the pattern or not
            let pattern = gamekeylist.join("$|");
            pattern = pattern.toLowerCase();
            let patternB = gamekeylist.join('|');
            patternB = patternB.toLowerCase();

            match_pattern = regexpattern(msg, '(' + run_prefix + '[ _](' + patternB + ')[ _]|' + pattern + '$)');
            if (match_pattern) {
                let game = match_pattern[1];
                if(!gamekeylist.includes(game)){ // key is not match in dir.json, do some work strip the string till it match kekw
                    var reg = new RegExp('^' + run_prefix + '[ _]');
                    game = game.replace(reg, '');
                    game = game.replace(/[^a-zA-Z0-9]/g, '');
                }

                // Do check monster type under the dir
                pattern = Object.keys(dirdata[game]);
                pattern = pattern.join("|");
                pattern = pattern.toLowerCase();

                match_pattern = regexpattern(msg, '(' + pattern + ')');
                if (match_pattern) {
                    let monster = match_pattern[1];
                    const embeds = generate_embed(dirdata[game][monster], bot.prefix_c[0]);
                    message.channel.send({ embeds: embeds }).catch(() => {/*Ignore error*/}); return; // Send a embed message and stop futher process
                }else{
                    // is not match going loop and read alt_text on dir.json
                    let list = Object.keys(dirdata[game]);
                    for (var i = 0; i < list.length; i++) {
                        if(dirdata[game][list[i]].alt_name === undefined) continue; // skip these process cause the alt_name not set
                        pattern = dirdata[game][list[i]].alt_name.join('|');
                        pattern = pattern.toLowerCase();

                        match_pattern = regexpattern(msg, '(' + pattern + ')');
                        if (match_pattern) {
                            const embeds = generate_embed(dirdata[game][list[i]], bot.prefix_c[0]);
                            message.channel.send({ embeds: embeds }).catch(() => {/*Ignore error*/}); return; // Send a embed message and stop futher process
                        }
                    }
                }

                message.channel.send('Incomplete/invalid command').catch(() => {/*Ignore error*/});
                return; // stop futher process
            }
        }

        // When user type !h
        if(msg === bot.prefix[1]){
            message.channel.send("**Help for MHDexBot**\n\n*__How to use the Dex Bot__*:\n!d 'monster name' 'game name'\nor\n!d 'game name' 'monster name'\n\n__Examples__:\n`!d rathalos 3`\n`!d 4 rathalos`\n`!d los x`").catch(() => {/*Ignore error*/});
            return;
        }

    });
});
client.login(process.env.TOKEN)