const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction
    ]
});


client.on('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}`);
});
// Commande pour envoyer le message
client.on('messageCreate', async (message) => {
    if (message.content === '!role') {

        // Vérifie si l'utilisateur a le rôle
        const role = message.guild.roles.cache.find(r => r.name === "Maire");

        if (!message.member.roles.cache.has(role.id)) {
            return message.reply("Tu n'as pas la permission d'utiliser cette commande.");
        }
    
        if (message.content === '!role') {
            const msg = await message.channel.send("ecrit");
            await msg.react('👍');
        }
    }
});
// Quand quelqu’un clique sur la réaction
client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;

    if (reaction.emoji.name === '👍') {
        const guild = reaction.message.guild;
        const member = guild.members.cache.get(user.id);

        const role = guild.roles.cache.find(r => r.name === "Mii"); // Mets le nom du rôle ici

        if (role) {
            await member.roles.add(role);
            console.log(`Rôle ajouté à ${user.tag}`);
        }
    }
});
client.on('messageReactionRemove', async (reaction, user) => {
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;

    if (reaction.emoji.name === '👍') {
        const guild = reaction.message.guild;
        const member = guild.members.cache.get(user.id);

        const role = guild.roles.cache.find(r => r.name === "Mii");

        if (role) {
            await member.roles.remove(role);
            console.log(`Rôle retiré à ${user.tag}`);
        }
    }
});

client.on('messageCreate', async (message) => {
    if (message.content === '!reglement') {

        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('⚠️ ON NE FAIT PAS DE DÉCALE ⚠️')
            .setDescription('**PAS DE NÉGOCIATION POSSIBLE**')
            .addFields(
                {
                    name: '📂 — 1 — Règlement cas général ❗',
                    value:
                    `§1.1 - Votre photo de profil ne doit pas contenir d'image NSFW.
§1.2 - Votre bannière ne doit pas contenir d'image ou vidéo NSFW.
§1.3 - Votre pseudo ne doit pas ressembler à un des staffs.
§1.4 - Votre biographie ne doit pas rediriger vers des arnaques ou liens explicites.
§1.5 - Le contournement de bannissement est interdit.`
                },
                {
                    name: '📂 — 2 — Règlement textuel ❗',
                    value:
                    `§2.1 - Toutes insultes sont strictement interdites.
§2.2 - Les sujets politiques ou religieux sont interdits.
§2.3 - Mentionner quelqu'un de manière abusive est interdit.
§2.4 - Utilisez les salons prévus à leur usage.
§2.5 - Restez polis et courtois.
§2.6 - Le partage d'informations personnelles sans consentement est interdit.
§2.7 - La promotion d’un autre serveur Discord sans autorisation est interdite.
§2.8 - Les messages à sous-entendu sexuel, racistes ou haineux sont interdits.
§2.9 - Les moqueries humoristiques ne sont permises que si les deux parties y consentent.`
                }
            )
            .setFooter({ text: 'Merci de respecter le règlement.' })
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });
    }
});

client.on('messageCreate', message =>{
    if (message.content === '/love') {
        message.reply('oui !');
    }
})
client.login(process.env.TOKEN);