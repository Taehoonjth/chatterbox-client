// YOUR CODE HERE:

$(document).ready(function() {
  
  window.app = {};

  app.init = function () {
    $.ajax({
      url: 'https://api.parse.com/1/classes/messages',
      type: 'GET',
      data: {order: '-createdAt'},
      
      success: function (data) {
        console.log(data);
        for (var i = 0; i < data.results.length; i ++) {
          var text = data.results[i].text;
          var user = data.results[i].username;
          if (!text || text.length < 1) {
            continue;
          }
          $('.newPosts').append('<tr><td>' + DOMPurify.sanitize(user) + '</td><td>' + DOMPurify.sanitize(text) + '</td></tr>');
          if (rooms[data.results[i].roomname] === undefined) {
            rooms[data.results[i].roomname] = data.results[i].roomname;
          }
        }
        for ( var key in rooms) {
          $('.dropdown-menu').append('<li><a href="#">' + DOMPurify.sanitize(key) + '</a></li>'); 
        }
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        //console.error('chatterbox: Failed to send message', data);
      }
    });
  };
  //app.init();
  window.rooms = {};

  $('input:text').focus(
    function() {
      $(this).val('');
    });

  $('#example-text-input').submit(function( event ) {
    // console.log('something');
  });

  $('#target').submit(function( event ) {
    // console.log( $('.userInput').val() );
    event.preventDefault();
    var userMessage = {
      username: window.location.search.replace('?username=', '').replace(/%20/g, ' '),
      text: $('.userInput').val(),
      roomname: 'lobby'
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
  window.app.init();
});