const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [
        partials.message,
        partials.channel,
        partials.reaction
    ]
});

client.on('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}`);
});
// Commande pour envoyer le message
client.on('messageCreate', async (message) => {
    if (message.content === '!role') {
        const msg = await message.channel.send("Clique sur 👍 pour recevoir le rôle !");
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