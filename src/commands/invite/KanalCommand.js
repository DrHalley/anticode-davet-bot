const BaseCommand = require('../../utils/structures/BaseCommand');
const { Database } = require("npm.db");
const db = new Database("database");
module.exports = class KanalCommand extends BaseCommand {
  constructor() {
    super('kanal', 'invite', []);
  }

  run(client, message, args) {
    if(!message.member.permissions.has('ADMINISTRATOR')) return message.reply('Yetkin yok');
    const kanal = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    if(!kanal) return message.reply('Geçersiz kanal');

    db.set(`davet_kanal.${message.guild.id}`, kanal.id);
    message.channel.send(`Davet kanalı ${kanal} olarak ayarlandı`);



  }
}