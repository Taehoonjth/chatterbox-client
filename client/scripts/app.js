// YOUR CODE HERE:


var app = {};
var initialized = false;
app.server = 'https://api.parse.com/1/classes/messages';
app.init = function () {
  
  rooms = {};

  app.handleSubmit = function (message) {
    app.send(message);
  };

  app.renderRoom = function (room) {
    //console.log(room);
    $('#roomSelect').append('<li><a class="roomName" href="#">' + DOMPurify.sanitize(room) + '</a></li>'); 
  };

  app.renderMessage = function (data) {
    if (typeof DOMPurify === 'undefined') {
      DOMPurify = {
        sanitize: function (value) {
          return value;
        }
      };
    }
    var user = DOMPurify.sanitize(data.username);
    var text = DOMPurify.sanitize(data.text);
    
    $('#chats').append('<tr><td><span class= "username btn btn-link limitTextSize">' + user + '</span></td><td>' + text + '</td></tr>');
    

  };

  app.fetch = function (room, friend) {
    if (room) {
      var query = {order: '-createdAt', where: {roomname: room}};
    } else if (!room && friend) {
      var query = {order: '-createdAt', where: {username: friend}};
    } else {
      var query = {order: '-createdAt'};
    } 
    $.ajax({
      url: app.server,
      type: 'GET',
      data: query,
      
      success: function (data) { 
        console.log(data);
        app.clearMessages();
        for (var i = 0; i < data.results.length; i ++) {
          if (!data.results[i].text || data.results[i].text.length < 1) {
            continue;
          }
          app.renderMessage(data.results[i]);
          var room = data.results[i].roomname;
          if (!rooms[room]) {
            rooms[room] = room;
          }
        }
        if (!initialized) {
          for (var key in rooms) {
            app.renderRoom(key); 
          }
        }
        initialized = true;
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch data', data);
      }
    });
  };
  
  $('input:text').focus(
    function() {
      $(this).val('');
    });

  $('#send').submit(function( event ) {
    // console.log( $('.userInput').val() );
    event.preventDefault();
    var userMessage = {
      username: location.search.replace('?username=', '').replace(/%20/g, ' '),
      text: $('.userInput').val(),
      roomname: $('.dropdown-toggle').text()
    };
    // console.log(userMessage);
    app.handleSubmit(userMessage);
    //app.init();
    app.fetch();
  });

  //$('#target').on('click', function() { app.init(); });

  app.send = function(message) {
    console.log('sent', message);

    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        // console.log(data);
        //app.init();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  };
  //app.init();

  $('button').on('click', function() {   
    $('a').on('click', function() {
      $('button').text($(this).text()).append('<span class="caret"></span>');
    });
  });
  app.clearMessages = function() {
    $('#chats').empty();
  };

  app.something = function () {
    $.ajax({
      url: undefined,
      type: 'GET',
      
      success: function (data) {
        console.log('it works!');
      }
    });
  };

  app.handleUsernameClick = function(context) {
    //debugger;
    //console.log($(context).text());
    var friend = $(context).text();
    app.fetch(false, friend);

  };

  $('#main').on('click', '.username', function (event) {
    //console.log(event);
    var context = this;
    app.handleUsernameClick(context);
  });

  $('body').on('click', '.newRoom', function (event) {
    var newRoomName = prompt('Type your new room name.');
    app.renderRoom(newRoomName);
  });

  $('body').on('click', '.roomName', function (event) {
    app.clearMessages();
    app.fetch($(this).text());
  });

  app.fetch();
};

$(document).ready(function() {
  console.log('triggered app init');
  if (!initialized) {
    app.init();  
  }
});