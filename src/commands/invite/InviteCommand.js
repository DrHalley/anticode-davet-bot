const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class InviteCommand extends BaseCommand {
  constructor() {
    super('invites', 'invites', ['davetler']);
  }

  async run(client, message, args) {
    message.guild.fetchInvites().then(guildInvites => {
      const filtered = guildInvites.filter(i => i.inviter.id === message.author.id)
      var toplamdavet = 0;
      filtered.forEach((i) => {
         toplamdavet = i.uses + toplamdavet;
      });
      message.channel.send(`${message.author} toplam davet sayın ${toplamdavet}`);
    })
    
  }
}