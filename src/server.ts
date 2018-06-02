declare var process: any;

import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as Discord from 'discord.js';

import { sendToChannels } from './discord/send';
import { getGuildInfo } from './discord/guild';

const app = express(),
  server = http.createServer(app),
  client = new Discord.Client(),
  CHANNEL_NAME = process.env.CHANNEL_NAME || '',
  BOT_TOKEN = process.env.BOT_TOKEN || '';

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

//Discord bot login
client.login(BOT_TOKEN);

//start server
server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port ${server}`);
});

var time: number = 0,
  fakeId: number = 0,
  connectionID: any;

wss.on('connection', (ws: WebSocket) => {
  time = Date.now();
  connectionID = `request#${fakeId++}-${time}`;
  (ws as any).id = connectionID;

  ws.on('message', (message: string) => {
    sendToChannels(client, message);
  });
  getGuildInfo(app, client, CHANNEL_NAME);
});

// wss.clients.forEach((item: any) => {
//   if (item.id !== connectionID) {
//     item.send(`Joined: ${connectionID}`);
//   }
// });
