const { Client, GatewayIntentBits, Partials } = require('discord.js');

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
        const msg = await message.channel.send("RÈGLEMENT DU SERVEURBienvenue sur 🌷Roulia Familia 🌷!Pour garantir une bonne ambiance, merci de lire et respecter les règles suivantes :⸻🔹 1. Respect avant tout→ Aucune insulte, propos haineux, racistes, sexistes, homophobes, ou discriminatoires ne sera toléré→ Restez courtois, même en cas de désaccord.🔹 2. Pas de spam ni de flood→ Évitez les messages répétitifs, l’abus de majuscules ou les réactions en chaîne.→ Ne spammez pas les salons, ni en texte ni en vocal.🔹3. Utilisez les bons salons→ Merci de parler dans le salon approprié (ex : pas de pub dans le #💬𝓓𝓲𝓼𝓬𝓾𝓼𝓼𝓲𝓸𝓷𝓼 𝓰𝓮𝓷𝓮𝓻𝓪𝓵𝓮𝓼💬, pas d’aide devoirs dans #média, etc.).→ Lisez la description des salons si besoin.🔹 4. Pas de pub sans autorisation→ Aucune publicité (serveur, chaîne YouTube, Twitch, etc.) sans l’accord du staff.🔹 5. Contenu NSFW interdit→ Ce serveur est tout public : aucun contenu choquant, sexuel ou inapproprié n’est autorisé.🔹 6. Pseudonymes corrects→ Choisis un pseudo lisible et respectueux.→ Pas de noms offensants ou provocants.🔹 7. Respect du staff→ Les décisions des modérateurs doivent être respectées.→ En cas de problème, contactez-les en message privé ou dans un salon prévu.🔹 8. Règles Discord→ Le règlement officiel de Discord s’applique ici aussi : https://discord.com/terms⸻✅ En restant sur ce serveur, tu acceptes ce règlement.Merci à toi, et bonne ambiance sur 🌷Roulia Familia 🌷! 🎉");
        await msg.react('👍');
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

client.on('messageCreate', message =>{
    if (message.content === '/love') {
        message.reply('oui !');
    }
})
client.login(process.env.TOKEN);