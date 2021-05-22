$(document).ready(function() {
//footer correction
  // if(document.querySelector('body').clientHeight < screen.availHeight){
  //   $('.footer-copyright').addClass('fixed');
  // }else{
  //   $('.footer-copyright').removeClass('fixed');
  // }
// ------------ user login -----------
 $(document).on('click','#clickUser',function(){
 $(".UserMenu").slideToggle();
 });

// ------------ Navigation -----------
 $('nav ul li a:not(:only-child)').click(function(e) {
      $(this).siblings('.nav-dropdown').toggle();
      $('.nav-dropdown').not($(this).siblings()).hide();
      e.stopPropagation();
    });
    $('html').click(function() {
      $('.nav-dropdown').hide();
    });
    $('#nav-toggle').click(function() {
      $('nav ul').slideToggle();
    });
    $('#nav-toggle').on('click', function() {
      this.classList.toggle('active');
    });



// ----------------- Back to top --------------
$(window).scroll(function() {
  if ($(window).scrollTop() > 300) {
   $('#BaktoTop').addClass('show');
  } else {
    $('#BaktoTop').removeClass('show');
  }
});
   $('#BaktoTop').on('click', function() {
    $('html, body').animate({scrollTop:0}, '300');
    });

});
	

