function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

$(document).ready(function() {
  // Test / driver code (temporary). Eventually will get this from the server.



  function renderTweets(tweets) {
    for (let individual = 0; individual < tweets.length; individual++) {
      $('#tweets-container').append(createTweetElement(tweets[individual]));
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
          <span class="post_date">${escape(data.created_at)}</span>
          <div class="icon">
            <i class="fas fa-flag"></i>
            <i class="fas fa-retweet"></i>
            <i class="fas fa-heart"></i>
          </div>
        </footer>
      </article>`;
    return $tweet;
  }

  function loadTweets(){
    $.get('http://localhost:8080/tweets', function (allTweets){
      renderTweets(allTweets);
    });
  }

  loadTweets();

});