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



app._lastShown = 0;
app._friends = {};
app._rooms = {};
app._currentRoom = 'All Rooms';

//take in data from .fetch and append to DOM
app.addMessage = (messageObj) => {
  var $message = $('<div class=message></div>');
  
  // escaping XSS
  for (var prop in messageObj) {
    messageObj[prop] = xssFilters.inHTMLData(messageObj[prop]);
  }
  
  // adding roomName to select dropdown if it doesn't exist
  if (!app._rooms[messageObj.roomname]) {
    app.addRoom(messageObj.roomname);
  }
  // TO FIX: THIS IS BREAKING IF NO ROOMNAME
  $message.addClass(messageObj.roomname.split(' ').join('_'));

  // adding username
  var $user = $('<span class=username></span>');
  $user.text(messageObj.username);

  // testing for friend & adding .friend
  if (app._friends[messageObj.username]) {
    $message.addClass('friend');
  }

  // adding message text
  $message.text(': ' + messageObj.text);

  $message.prepend($user); 
  
  // deciding order for message to be added
  if (app._lastShown) {
    $('#chats').prepend($message);  
  } else {
    $('#chats').append($message);  
  }


  // filter for roomName, if it doesn't match the currentRoom & it's not all Rooms, then hide;
  if (app._currentRoom !== 'All Rooms' && messageObj.roomname !== app._currentRoom) {
    $message.hide();
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
  messageObj.roomname = app._currentRoom;
  app.send(messageObj);
  $('#message').val('');
};

app.addRoom = (roomname) => {
  app._rooms[roomname] = true;
  var $roomOption = $('<option></option>');
  $roomOption.attr('value', roomname);
  $roomOption.text(roomname);
  $('#roomSelect').append($roomOption);
};

app.addFriend = (node) => {
  var username = node.text();
  if (!app._friends[username]) {
    app._friends[username] = true;
    var $spans = $('span:contains("' + username + '")');
    $spans.parent().addClass('friend');
  }
};

app.changeRoom = () => {
  var $selected = $('#roomSelect option:selected');
  if ($selected.text() === 'New Room...') {
    app._currentRoom = prompt('Name your new room');
    app.addRoom(app._currentRoom);
    // remove the option:selected attribute from the current one and make this new room selected
    $selected.removeAttr('selected');
    $('option:contains("' + app._currentRoom + '")').attr('selected', 'selected');
  } else {
    app._currentRoom = $selected.text();
  }

  if (app._currentRoom === 'All Rooms') {
    $('#chats').children().show();
  } else {
    $('#chats').children().hide();
    var classname = '.' + app._currentRoom;
    classname = classname.split(' ').join('_');
    var $roomShow = $(classname);
    $roomShow.show(); // is show not working?
  }
};

app.init = () => {
  //initiate the app with loaded messages
  app.fetch();

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

  //listener for RoomSelect
  $('#roomSelect').on('change', app.changeRoom);
};

$(document).ready(function() {
// Load chatroom & event listeners
  app.init();
});






