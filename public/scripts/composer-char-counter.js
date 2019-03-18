$(document).ready(function() {
  $('textarea').on('input', function(){
    var msg = $(this).val();
    var count = 140 - (msg.length);
    $(this).siblings('.counter').text(count);
      $(this).siblings('.counter').toggleClass('error', count < 0);
    });






  // --- our code goes here ---
});
