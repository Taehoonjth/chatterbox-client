// YOUR CODE HERE:

$(document).ready(function() {
  
  window.app = {};
  app.init = function () {
    $.get('https://api.parse.com/1/classes/messages?where={"createdAt":{"$gte":{"__type":"Date","iso":"2016-12-31T18:02:52.249Z"}}}', function (data) {
      console.log(data);
      for (var i = 0; i < data.results.length; i ++) {
        var text = data.results[i].text;
        var user = data.results[i].username;
        $('.newPosts').append('<tr><td>' + user + '</td><td>' + text + '</td></tr>');
        if (rooms[data.results[i].roomname] === undefined) {
          rooms[data.results[i].roomname] = data.results[i].roomname;
        }
      }
      for ( var key in rooms) {
        $('.dropdown-menu').append('<li><a href="#">' + key + '</a></li>'); 
      }
    });
  };
  window.rooms = {};



  $('input:text').focus(
    function() {
      $(this).val('');
    });

  $('#example-text-input').submit(function( event ) {
    console.log('something');
  });

  $('#target').submit(function( event ) {
    console.log( $('.userInput').val() );
    event.preventDefault();
    var userMessage = {
      username: 'shawndrost',
      text: $('.userInput').val(),
      roomname: 'lobby'
    };
    app.send(userMessage);
  });

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
        app.init();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  };
});