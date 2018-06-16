import { VoiceChannel } from 'discord.js';

export function sendToChannels(client: any, channels: any, message: string) {
  client.guilds.forEach((guild: any) => {
    //for each guild the bot is in
    let sendToChannels: any = channels.split(',');

    if (sendToChannels.length > 0) {
      sendToChannels.forEach((channelName: any) => {
        let channel = guild.channels.find(
          (channel: any) =>
            channel.type == 'text' &&
            channel.name == channelName &&
            channel.permissionsFor(guild.me).has('SEND_MESSAGES')
        );

        console.log(channel);

        if (channel) channel.send(message);
      });
    } else {
      console.error('PLEASE SETUP CHANNELS');
    }
  });
}
