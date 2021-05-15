const BaseCommand = require('../../utils/structures/BaseCommand');
const { Database } = require("npm.db");
const db = new Database("database");
module.exports = class DavetrolCommand extends BaseCommand {
  constructor() {
    super('davetrol', 'invite', ['rol-ekle']);
  }

  run(client, message, args) {
    if(!message.member.permissions.has('ADMINISTRATOR')) return message.reply('Yetkin yok');
    const rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if(!rol) return message.reply('Geçersiz rol');
    if(!args[1]) return message.reply('Bir davet sayısı gir')
    db.push(`roller_${message.guild.id}`, {roleId: rol.id, invite: args[1]});
    message.channel.send(`Artık birisinin davet sayısı ${args[1]} olursa ${rol} rolünü vereceğim`);
  }
}