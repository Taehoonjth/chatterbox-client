// YOUR CODE HERE:


window.app = {};
window.app.init = function () {
  
  window.rooms = {};

  app.renderRoom = function (room) {
    //console.log(room);
    $('#roomSelect').append('<li><a href="#">' + DOMPurify.sanitize(room) + '</a></li>'); 
  };

  app.renderMessage = function (data) {
    if (typeof DOMPurify === 'undefined') {
      window.DOMPurify = {
        sanitize: function (value) {
          return value;
        }
      };
    }
    var user = DOMPurify.sanitize(data.username);
    var text = DOMPurify.sanitize(data.text);
    
    $('#chats').append('<tr><td><span class= "userName btn btn-link limitTextSize">' + user + '</span></td><td>' + text + '</td></tr>');
    

  };

  app.fetch = function (fetch) {
    $.ajax({
      url: 'https://api.parse.com/1/classes/messages',
      type: 'GET',
      data: {order: '-createdAt'},
      
      success: function (data) {
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
        for (var key in rooms) {
          app.renderRoom(key); 
        }
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        //console.error('chatterbox: Failed to send message', data);
      }
    });
  };
  
  $('input:text').focus(
    function() {
      $(this).val('');
    });

  $('#target').submit(function( event ) {
    // console.log( $('.userInput').val() );
    event.preventDefault();
    var userMessage = {
      username: window.location.search.replace('?username=', '').replace(/%20/g, ' '),
      text: $('.userInput').val(),
      roomname: $('.dropdown-toggle').text()
    };
    app.send(userMessage);
    //window.app.init();
  });

  //$('#target').on('click', function() { window.app.init(); });

  app.send = function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        console.log(data);
        //window.app.init();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  };
  //window.app.init();

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
  //app.handleUsernameClick = function() {
    
  //};

  $('body').on('click', '.userName', function (event) {
    console.log('user clicked!');
    return true;
  });
  app.fetch();
  $('body').on('click', '.newRoom', function (event) {
    var newRoomName = prompt('Type your new room name.');
    app.renderRoom(newRoomName);
  });

};

$(document).ready(function() {
  console.log('triggered app init');
  app.init();
});