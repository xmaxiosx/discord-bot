const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');

const fs = require('fs');
let levels = require('./levels.json');

function saveLevels() {
    fs.writeFileSync('./levels.json', JSON.stringify(levels, null, 2));
}

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
///////////////////
//code regle role//
///////////////////
// Commande fusionnée
client.on('messageCreate', async (message) => {
    if (message.content === '!setup_reglement') {

        const allowedRoleName = "Maire"; // rôle autorisé
        const allowedRole = message.guild.roles.cache.find(r => r.name === allowedRoleName);

        if (!allowedRole) return message.reply(`Le rôle **${allowedRoleName}** est introuvable.`);
        if (!message.member.roles.cache.has(allowedRole.id)) {
            return message.reply("Tu n'as pas la permission d'utiliser cette commande.");
        }

        // Salon pour le règlement
        const reglementChannel = client.channels.cache.get("1473646942264229929");
        if (!reglementChannel) return message.reply("Salon règlement introuvable.");

        // Salon pour le message de rôle
        const roleChannel = client.channels.cache.get("1473646942264229929");
        if (!roleChannel) return message.reply("Salon rôle introuvable.");

        // Embed règlement
        const embed1 = new EmbedBuilder()
            .setColor('#850a0a')
            .setTitle('📘 Règlement du serveur')
            .setDescription("Merci de lire attentivement les règles ci-dessous.")
            .addFields(
                {
                    name: "🔹 1. Respect avant tout",
                    value:
                    `→ Aucune insulte, propos haineux, racistes, sexistes, homophobes ou discriminatoires ne sera toléré.
→ Restez courtois, même en cas de désaccord.`
                },
                {
                    name: "🔹 2. Pas de spam ni de flood",
                    value:
                    `→ Pas de messages répétitifs, abus de majuscules ou réactions en chaîne.
→ Ne spammez pas les salons, ni en texte ni en vocal.`
                },
                {
                    name: "🔹 3. Utilisez les bons salons",
                    value:
                    `→ Merci de parler dans le salon approprié.
→ Lisez la description des salons si besoin.`
                },
                {
                    name: "🔹 4. Pas de pub sans autorisation",
                    value:
                    `→ Aucune publicité sans accord du staff.`
                },
                {
                    name: "🔹 5. Contenu NSFW interdit",
                    value:
                    `→ Aucun contenu choquant, sexuel ou inapproprié n’est autorisé.`
                },
                {
                    name: "🔹 6. Pseudonymes corrects",
                    value:
                    `→ Choisis un pseudo lisible et respectueux.
→ Pas de noms offensants ou provocants.`
                },
                {
                    name: "🔹 7. Respect du staff",
                    value:
                    `→ Les décisions des modérateurs doivent être respectées.
→ En cas de problème, contactez-les en privé ou dans un salon prévu.`
                }
            )
            .setFooter({ text: "Merci de respecter le règlement du serveur." })
            .setTimestamp();

        // Envoi du règlement
        await reglementChannel.send({ embeds: [embed1] });
        
        const embed2 = new EmbedBuilder()
            .setColor('#ffffff')
            .setTitle('📘 Role')
            .setDescription("Merci de prendre le role pour avoir accées au serveurs.")

        // Envoi du message pour les rôles
        const msg = await roleChannel.send({ embeds: [embed2] });
        await msg.react('🔥');

        message.reply("Configuration terminée !");
    }
});

// Cooldown anti-spam (en millisecondes)
const cooldown = new Map();
const COOLDOWN_TIME = 2000; // 2 secondes

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    const userId = message.author.id;

    // Vérifier le cooldown
    if (cooldown.has(userId)) {
        const lastMessage = cooldown.get(userId);
        const now = Date.now();

        if (now - lastMessage < COOLDOWN_TIME) {
            return; // pas d'XP si spam
        }
    }

    cooldown.set(userId, Date.now());

    // Initialiser l'utilisateur si pas encore enregistré
    if (!levels[userId]) {
        levels[userId] = {
            xp: 0,
            level: 1
        };
    }

    // Gain d'XP
    const xpGain = Math.floor(Math.random() * 10) + 5;
    levels[userId].xp += xpGain;

    // Calcul du niveau
    const xpNeeded = levels[userId].level * 100;

    if (levels[userId].xp >= xpNeeded) {
        levels[userId].level++;
        levels[userId].xp = 0;

        message.channel.send(`🎉 **${message.author.username}** vient de passer niveau **${levels[userId].level}** !`);
    }

    saveLevels();
});

//voir level
client.on('messageCreate', (message) => {
    if (message.content === '!level') {
        const userId = message.author.id;

        if (!levels[userId]) {
            return message.reply("Tu n'as pas encore de niveau.");
        }

        const embed = new EmbedBuilder()
            .setColor('#00aaff')
            .setTitle(`📊 Niveau de ${message.author.username}`)
            .addFields(
                { name: "Niveau", value: `${levels[userId].level}`, inline: true },
                { name: "XP", value: `${levels[userId].xp} / ${levels[userId].level * 100}`, inline: true }
            )
            .setThumbnail(message.author.displayAvatarURL())
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
});

//leader borad
client.on('messageCreate', (message) => {
    if (message.content === '!leaderboard') {

        const sorted = Object.entries(levels)
            .sort((a, b) => b[1].level - a[1].level || b[1].xp - a[1].xp)
            .slice(0, 10);

        let description = "";

        sorted.forEach(([userId, data], index) => {
            const user = message.guild.members.cache.get(userId);
            const username = user ? user.user.username : "Utilisateur inconnu";

            description += `**${index + 1}. ${username}** — Niveau ${data.level} (${data.xp} XP)\n`;
        });

        const embed = new EmbedBuilder()
            .setColor('#ffaa00')
            .setTitle("🏆 Classement des niveaux")
            .setDescription(description)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
});

// Réaction : ajouter rôle
client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;

    if (reaction.emoji.name === '🔥') {
        const guild = reaction.message.guild;
        const member = guild.members.cache.get(user.id);
        const role = guild.roles.cache.find(r => r.name === "Mii");

        if (role) await member.roles.add(role);
    }
});

// Réaction : retirer rôle
client.on('messageReactionRemove', async (reaction, user) => {
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;

    if (reaction.emoji.name === '🔥') {
        const guild = reaction.message.guild;
        const member = guild.members.cache.get(user.id);
        const role = guild.roles.cache.find(r => r.name === "Mii");

        if (role) await member.roles.remove(role);
    }
});

client.on('messageCreate', message =>{
    if (message.content === '/love') {
        message.reply('oui !');
    }
})
client.login(process.env.TOKEN);