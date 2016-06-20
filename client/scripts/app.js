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


$(document).ready(function() {
  let app = {};
  let holder;

  //GET
  let get = $.ajax({
    url: 'https://api.parse.com/1/classes/messages',
    method: 'GET'
  }).done(function(data) {
    console.log(data);
    for (var newMessage of data.results) {
      var message = newMessage.username + ': ' + newMessage.text;
      app.addMessage(message);
    }
  });


  app.addMessage = (message) => {
    var $message = $('<div class=message></div>');
    $message.text(message);
    $('#chats').append($message);
  };

  //POST
  $.ajax({
    url: 'https://api.parse.com/1/classes/messages',
    method: 'POST',
    data: JSON.stringify({
      username: 'CC',
      text: 'whatup',
      roomname: 'all'
    }),
    datatype: 'json'
  }).done(function() {
    console.log('sent');
  });



});