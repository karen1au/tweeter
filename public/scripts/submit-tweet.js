$(document).ready(function() {
  $('form').submit(function(event){
    var newTweet = $(this).serialize();
    $.post(newTweet, function(data){
      $('/tweets').html(data);
    });

    // console.log(newTweet);
    // .then(function (postTweet) {
    event.preventDefault();
    });



  // --- our code goes here ---
});
