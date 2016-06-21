// // YOUR CODE HERE:
// Use ES6
// arrow functions
// spread (...) operator
// rest parameters
// object literal extensions
// for...of loops (a new for loop, what!!)
// template strings

// object named app
// app.init 
  // initiate the app
// app.send(message)
  // submit a POST request with the message obj via $.ajax;
// app.fetch()
  // submit a GET request via $.ajax;
// app.clearMessages() 
  // clear messages from DOM (clear #chats)
// app.addMessage(message) 
  // add messages to DOM (to #chats)
  // use jQuery to append messages in proper format
// app.addRoom
  // add rooms to DOM; use #roomSelect
// app.addFriend
  // see messages just from friend if username is clicked
// app.handleSubmit
  // send a message on click
  // needs a submit button with a form for message


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

//take in data from .fetch and append to DOM
app.addMessage = (messageObj) => {
  var $message = $('<div class=message></div>');
  var message = messageObj.username + ': ' + messageObj.text;
  $message.text(message);
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
      var newMessages = _.filter(data.results, (message) => {
        return Date.parse(message.createdAt) > app._lastShown;
      }); // return an array of new messages;

      for (var messageObj of newMessages) {
        app.addMessage(messageObj);
      }
      
      if (newMessages[0]) {
        app._lastShown = Date.parse(newMessages[0].createdAt);
      }
      // setting new timeStamp if there is a new message
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
  var messageObj = {};
  messageObj.username = $('#username').val();
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


$(document).ready(function() {
  app.init();
  // app.send({
  //   username: 'sd/cc',
  //   text: 'yo',
  //   roomname: 'all'
  // });
  // setInterval(app.fetch, 2000);
  $('#load').on('click', app.fetch);

  $('.submit').on('submit', () => {
    app.handleSubmit();
  });    
});






