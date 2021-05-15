const { Database } = require("npm.db");
const db = new Database("database")
const { Client } = require('discord.js');
const { registerCommands, registerEvents } = require('./utils/registry');
const config = require('../slappey.json');
const client = new Client();

(async () => {
  client.commands = new Map();
  client.events = new Map();
  client.prefix = config.prefix;
  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  await client.login(config.token);
})();


//bu kısım githubdan  https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/coding-guides/tracking-used-invites.md buradan alınmıştır
const invites = {};

// A pretty useful method to create a delay without blocking the whole script.
const wait = require('util').promisify(setTimeout);

client.on('ready', async () => {
  // "ready" isn't really ready. We need to wait a spell.
  await wait(1000);

  // Load all invites for all guilds and save them to the cache.
  client.guilds.cache.forEach(g => {
    g.fetchInvites().then(guildInvites => {
      invites[g.id] = guildInvites;
    });
  });
});


//alınan kısım bitti şimdi guildMemberAdd kısmına geçelim


client.on('guildMemberAdd', async member => {

  member.guild.fetchInvites().then(davetler => {
    const eski = invites[member.guild.id]
    //burası karşılaştırma için lazım ^^
    invites[member.guild.id] = davetler;
    //burada davetleri güncelledik
    //şimdi karşılaştırma yapalım

    const davet = davetler.find(x => eski.get(x.code).uses < x.uses);

    const davetci = member.guild.members.cache.get(davet.inviter.id);
    const kanal = member.guild.channels.cache.get(db.get(`davet_kanal.${member.guild.id}`))
    if(!kanal) return;
    kanal.send(`${member.user} sunucuya katıldı. Davet eden ${member.user.username}#${member.user.discriminator}. Toplam davet sayısı: ${davet.uses}`);
    const roller = db.get(`roller_${member.guild.id}`);
    roller.forEach((role) => {
      if(davet.uses >= role.invite){
        const roll = member.guild.roles.cache.get(role.roleId)
        davetci.roles.add(roll);
        davetci.user.send(`Artık ${role.invite} davetin olduğu için sana ${roll} rolünü verdik`);
      }
    })
    

  })

});

client.on('guildMemberRemove', async member => {

  member.guild.fetchInvites().then(davetler => {
    const eski = invites[member.guild.id]
    //burası karşılaştırma için lazım ^^
    invites[member.guild.id] = davetler;
    //burada davetleri güncelledik
    //şimdi karşılaştırma yapalım

    const davet = davetler.find(x => eski.get(x.code).uses > x.uses);

    const davetci = member.guild.members.cache.get(davet.inviter.id);
    const kanal = member.guild.channels.cache.get(db.get(`davet_kanal.${member.guild.id}`))
    if(!kanal) return;
    kanal.send(`${member.user} sunucudan ayrıldı. Davet eden ${member.user.username}#${member.user.discriminator}. Toplam davet sayısı: ${davet.uses}`);
    

  })

})