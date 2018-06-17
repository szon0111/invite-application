declare var $: any;

const titles = {
  welcomeTitle: 'Welcome to the Merit Inite Application!',
  waitingForInvite: 'Your messasge has been sent to community. Good luck!',
  noResponse: 'No luck :(',
  userConnected: 'Congrats! Your request accepted!',
  joinUs: 'Join US!',
};
const appTitle = $('.chatWindow__title .text'),
  noResponse = $('.noResponse'),
  sendingForm = $('#sendRequest'),
  countDown = $('.countDown'),
  responseWindow = $('.responseWindow'),
  messagesContainer = $('.responseWindow__dialog'),
  navigateToCommunitytab = $('.responseWindow__navigator .button'),
  communityView = $('.communityView');

$('document').ready(function() {
  appTitle.text(titles.welcomeTitle);
  sendingForm.submit(function(e) {
    e.preventDefault();
    let message = $('textarea[name=message]').val();
    if (message.length > 1) {
      const socket: any = new WebSocket('ws://localhost:8999/');
      socket.onopen = function() {
        socket.send(message);
        sendingForm.removeClass('invalid').addClass('valid');
        countDown.addClass('active');
        appTitle.text(titles.waitingForInvite);
        requestStatus(socket, 10).then((res: any) => {
          if (!res.status) {
            appTitle.text(titles.noResponse);
            countDown.removeClass('active');
            noResponse.addClass('active');
          } else {
            countDown.removeClass('active');
            appTitle.text(titles.userConnected);
            responseWindow.addClass('active');
          }
        });
      };
    } else {
      sendingForm.addClass('invalid').removeClass('valid');
    }
  });
});

navigateToCommunitytab.click(() => {
  appTitle.text(titles.joinUs);
  responseWindow.removeClass('active');
  communityView.addClass('active');
});

function requestStatus(socket, remainTime: number) {
  return new Promise(resolve => {
    let remainTimeInMs = remainTime * 60;
    let interval = setInterval(() => {
      var t = remainTimeInMs-- * 1000,
        minutes = `0${Math.floor(t / 1000 / 60 % 60)}`,
        seconds = `${Math.floor(t / 1000 % 60)}`,
        progress = (remainTime * 60 - remainTimeInMs--) / (remainTime * 60) * 100;
      if (parseFloat(seconds) < 10) seconds = `0${seconds}`;

      if (t > 0) {
        $('.timer__item.minutes').text(minutes);
        $('.timer__item.seconds').text(seconds);
        $('.dinamyc .progress').css('stroke-dasharray', `${progress} 100`);
      } else {
        clearInterval(interval);
        resolve(new inviteResponse(false, '{author: "Merit", message: "No response"}'));
      }
    }, 1000);
    socket.onmessage = function(event) {
      if (interval) {
        clearInterval(interval);
      }
      resolve(new inviteResponse(true, event.data));
      printMessage(messagesContainer, JSON.parse(event.data));
    };
  });
}

function printMessage(container: any, object: any) {
  $(messageTemplate(object.author, object.message)).prependTo(container);
}

function messageTemplate(author: string, message: string) {
  return `<div class="dialog__item">
            <div class="item__author">@${author}</div>
            <div class="item__message">${message}</div>
          </div>`;
}

// Class for invite response for form messanger
class inviteResponse {
  status: boolean;
  message: string;
  constructor(status: boolean, message: string) {
    this.status = status;
    this.message = message;
  }
}
