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

        // Optionnel : limiter aux admins
        const adminRole = message.guild.roles.cache.find(r => r.name === "Maire");
        if (!message.member.roles.cache.has(adminRole?.id)) {
            return message.reply("Tu n'as pas la permission d'utiliser cette commande.");
        }

        const channel = client.channels.cache.get("1473646942264229929");
        if (!channel) return message.reply("Salon introuvable.");

        const embed = new EmbedBuilder()
            .setColor('#aa0c0c')
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
                    `→ Parlez dans le salon approprié.
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
                    `→ Aucun contenu choquant, sexuel ou inapproprié.`
                },
                {
                    name: "🔹 6. Pseudonymes corrects",
                    value:
                    `→ Choisissez un pseudo lisible et respectueux.
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

        await channel.send({ embeds: [embed] });
    }
});



client.on('messageCreate', message =>{
    if (message.content === '/love') {
        message.reply('oui !');
    }
})
client.login(process.env.TOKEN);