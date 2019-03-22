// security check for user input
function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

$(document).ready(function() {
  //adding tweet from data base
  function renderTweets(tweets) {
    for (let individual = 0; individual < tweets.length; individual++) {
      $('#tweets-container').prepend(createTweetElement(tweets[individual]));
    }
  }

  function createTweetElement(data) {
    let $tweet = `
      <article>
        <header>
          <img class="avatar" src=${escape(data.user.avatars.small)}>
          <span class="user_name">${escape(data.user.name)}</span>
          <span class="user_id">${escape(data.user.handle)}</span>
        </header>
        <div class="content">
          <p>${escape(data.content.text)}</p>
        </div>
        <footer>
          <span class="post_date">${escape(moment(data.created_at).fromNow())}</span>
          <div class="icon">
            <i class="fas fa-flag"></i>
            <i class="fas fa-retweet"></i>
            <i class="fas fa-heart" id="${data._id}"></i>
            <span class="likeCount">${data.like_count}</span>
          </div>
        </footer>
      </article>`;
    return $tweet;
  }
  //load tweets from database
  function loadTweets(){
    $.get('http://localhost:8080/tweets', function (allTweets){
      renderTweets(allTweets);
    });
  }

  loadTweets();

  //post submit form with validation check
  $('.new-tweet form').submit(function(event){
    const tweetLength = $('.new-tweet textarea').val().trim();
    const newTweet = $(this).serialize();
    if (tweetLength.length > 140){
      $('#input_long').text('Time to Marie Kondo your tweet!');
      $('.error_input').fadeIn('fast');
    } else if (tweetLength <= 0){
      $('#input_long').text('I can\'t hear you!');
      $('.error_input').fadeIn('fast');
      } else {
        $('.error_input').fadeOut('fast');
        $.post("http://localhost:8080/tweets", newTweet).then(() => {
          $('#tweets-container').empty();
          loadTweets();
          $('textarea').val('');
          $('.counter').text('140');
        })
        ;
       }
    event.preventDefault();
  });

  //toggling new tweet form
  $('#compose').click(function(){
    $('.new-tweet').slideToggle();
    $('textarea').focus();
    });

  //toggling register form
  $('#register').click(function(){
    $('#register_form').slideToggle();
  });

  $('#register_form form').submit(function(event){
    if ($("#register_form input[name='username']").val().length > 0){
      $("#register_form input[name='username']").focus().css('outline-color', '#FF0000');
      $('#username-error').text('Username already exists.').fadeIn('fast');
    }

    // event.preventDefault();
  });


  //like-btn
  $('body').on('click', '.fa-heart', function() {
    $.ajax({
      method: 'POST',
      url: '/tweets/' + this.id
    });
      $('#tweets-container').empty();
      loadTweets();

  });


});