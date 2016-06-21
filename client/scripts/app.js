// // YOUR CODE HERE:
// Use ES6
// arrow functions
// spread (...) operator
// rest parameters
// object literal extensions
// for...of loops (a new for loop, what!!)
// template strings

// message is in object form
// ex:  var message = {
        //   username: 'Mel Brooks',
        //   text: 'It\'s good to be the king',
        //   roomname: 'lobby'
        // };

let app = {};
app.server = 'https://api.parse.com/1/classes/messages';

app.init = () => {
  //initiate the app with loaded messages
  app.fetch();
};

app._lastShown = 0;
app._friends = {};

//take in data from .fetch and append to DOM
app.addMessage = (messageObj) => {
  var $message = $('<div class=message></div>');
  //TODO: THINK ABOUT THIS. for new messages, check for username class, if 
  // create a friend storage object, search for username in friend object, if true, then add .friend to it
  // but for old messages, we will have to do a one-time loop everytime a new friend is added. 
  // another option is creating a customized hash-function-esque numerical friend ID and setting that as a class? 
  $message.data('user', messageObj.username);
  var $user = $('<span class=username></span>');
  if (app._friends[messageObj.username]) {
    $message.addClass('friend');
  }
  $user.text(messageObj.username);
  $message.text(': ' + messageObj.text);
  $message.prepend($user); 
  if (app._lastShown) {
    $('#chats').prepend($message);  
  } else {
    $('#chats').append($message);  
  }    
};

app.clearMessages = function() {
  $('#chats').html('');
};

//GET
app.fetch = () => {
  $.ajax({
    url: app.server,
    type: 'GET',
    success: (data) => {
      // return an array of new messages;
      var newMessages = _.filter(data.results, (message) => {
        return Date.parse(message.createdAt) > app._lastShown;
      }); 

      // loop through new messages and add them to DOM
      for (var messageObj of newMessages) {
        app.addMessage(messageObj);
      }

      // setting new time to compare against if there is a new message
      if (newMessages[0]) {
        app._lastShown = Date.parse(newMessages[0].createdAt);
      }
    },
    error: () => {
      console.log('error on fetch');
    }
  });
};

//POST
app.send = (message) => {
  message = JSON.stringify(message);
  // console.log('message in app.send:', message);
  $.ajax({
    url: app.server,
    type: 'POST',
    data: message,
    datatype: 'json',
    success: () => {
      app.fetch();
      // draw new messages from parse server; 
      // keep track of messages that are in the DOM and only append new ones
    }
  });
};

app.handleSubmit = () => {
  var username = window.location.search;
  username = username.slice(username.indexOf('=') + 1);
  var messageObj = {};
  messageObj.username = username;
  messageObj.text = $('#message').val();
  messageObj.roomname = 'lobby';
  app.send(messageObj);
  $('#message').val('');
};

app.addRoom = (roomname) => {
  var $roomOption = '<option></option>';
  $roomOption.text = roomname;
  $('#roomSelect').append($roomOption);
};

app.addFriend = (node) => {
  var username = node.text();
  console.log('username in addFriend', username);
  if (!app._friends[username]) {
    app._friends[username] = true;
    var $spans = $('span:contains("' + username + '")');
    $spans.parent().addClass('friend');
    console.log($spans.parent());
  }
  
  $(node).parent().addClass('friend');
  $(node).parent(); // get username and update the css of it
};


$(document).ready(function() {

// Load chatroom's messages
  app.init();

// can probably move this into app.init(). it just fetches every 2 seconds.
  setInterval(app.fetch, 2000);

// Load new messages on click
  $('#load').on('click', app.fetch);


// For submitting the message form
  $('#send').on('submit', (event) => {
    event.preventDefault();
    app.handleSubmit();
  });

// DON'T USE ES6 FOR THIS, IT PRESERVES THE THIS BINDING TO THE DOCUMENT
  $('#chats').on('click', '.username', function() {
    app.addFriend($(this));    
  });
});






