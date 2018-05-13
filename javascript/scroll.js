/* $(document).ready(function() {

   var toggleAffix = function(affixElement, scrollElement, wrapper) {
    
      var height = affixElement.outerHeight(),
          top = wrapper.offset().top;
      
      if (scrollElement.scrollTop() >= top){
          wrapper.height(height);
          affixElement.addClass("affix");
      }
      else {
          affixElement.removeClass("affix");
          wrapper.height('auto');
      }
        
    };

    
  $('[data-toggle="affix"]').each(function() {
    var ele = $(this),
        wrapper = $('<div></div>');
    
    ele.before(wrapper);
    $(window).on('scroll resize', function() {
        toggleAffix(ele, $(this), wrapper);
    });

    toggleAffix(ele, $(window), wrapper);
  });
  */
/*
 $(document).ready(function() {
 var myNav = document.getElementById('myAffix');
 window.onscroll = function () { 
     "use strict";
     if (document.body.scrollTop >= 50 ) {
         myNav.classList.add("nav-colored");
         myNav.classList.remove("nav-transparent");
     } 
     else {
         myNav.classList.add("nav-transparent");
         myNav.classList.remove("nav-colored");
     }
 };

}); */
/*

$(document).ready(function(){       
    var scroll_start = 0;
    var startchange = $('#startchange');
    var offset = startchange.offset();
     if (startchange.length){
    $(document).scroll(function() { 
       scroll_start = $(this).scrollTop();
       if(scroll_start > offset.top) {
           $(".navbar").addClass("stillTop");
           $(".navbar").css('background-color', '#f0f0f0');
        } else {
            $(".navbar").addClass("bottom");
           $('.navbar').css('background-color', 'transparent');
        }
    });
     }
 });*/

 /*

 $(function () {
    $(document).scroll(function () {
        var $nav = $(".navbar");
        $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
      });
  });
  */

 $(document).ready(function(){

    var checkScrollBar = function(){
      $('.navbar').css({
        backgroundColor: $(this).scrollTop() > 1 ?
          'rgb(0, 0, 0)' : 'transparent'
      })
    }
    $(window).on('load resize scroll', checkScrollBar)
    });