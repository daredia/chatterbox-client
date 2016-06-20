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

app.init = () => {
  //initiate the app with loaded messages
  app.fetch();
};

app._lastShown = 0;

//take in data from .fetch and append to DOM
var showMessages = (data) => {
  var newMessages = _.filter(data.results, (message) => {
    return Date.parse(message.createdAt) > app._lastShown;
  }); // return an array of new messages
  
  for (var messageObj of newMessages) {
    var $message = $('<div class=message></div>');
    var message = messageObj.username + ': ' + messageObj.text;
    $message.text(message);
    $('#chats').append($message);
  }
  console.log(newMessages);

  // setting new timeStamp if there is a new message
  if (newMessages[0]) {
    app._lastShown = Date.parse(newMessages[0].createdAt);   
  }
};

//GET
app.fetch = () => {
  $.ajax({
    url: 'https://api.parse.com/1/classes/messages',
    method: 'GET',
    success: showMessages,
    error: () => {
      console.log('error on fetch');
    }
  });
};

//POST
app.send = (message) => {
  message = JSON.stringify(message);
  $.ajax({
    url: 'https://api.parse.com/1/classes/messages',
    method: 'POST',
    data: message,
    datatype: 'json',
    success: () => {
      app.fetch();
      // draw new messages from parse server; 
      // keep track of messages that are in the DOM and only append new ones
    }
  });
};



$(document).ready(function() {
  app.init();
  app.send({
    username: 'sd/cc',
    text: 'yo',
    roomname: 'all'
  });
});