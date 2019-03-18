$(document).ready(function() {
  $('textarea').on('input', function(){
    var msg = $(this).val();
    var count = 140 - (msg.length+1);
    $(this).siblings('.counter').text(count);
    if (count < 0 ){
      $(this).siblings('.counter').css({'color': 'red'});
    } else {
      $(this).siblings('.counter').css({'color': 'black'});
    }
  });






  // --- our code goes here ---
});