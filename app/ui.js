// Smooth Scrolling
// From CSS Tricks: http://css-tricks.com/snippets/jquery/smooth-scrolling/
// Added extra 48px of offset to accommodate margins and padding

jQuery(function( $ ) {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top - 48
        }, 1000);
        return false;
      }
    }
  });
});