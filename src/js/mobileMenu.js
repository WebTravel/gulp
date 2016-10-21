;(function($, window, document, undefined){
  
  //vars block
    var buttonNextLevelHtml = '<span class="arrow js-arrow">&rsaquo;</span>',
      buttonPrevLevelHtml = '<li class="back js-back">Назад</li>',
      toggle = $('.js-toggle'),
      overlay = $('.overlay'),
      body = $('body'),
      menu = $('.multilevelMenu'),
      link = menu.find('a'),
      menuList = $('.submenu__list'),
      w = window.innerWidth ? window.innerWidth : $(window).width(); // get screen width

  //create animate-menu function
  function activeMenu() {
    body.toggleClass('fixed');
    setTimeout(function() { $('.close-list').removeClass('close-list') }, 400);
  };
  
  //animate menu function Call
  toggle.add(overlay).on("click", function(){
      activeMenu();
  });
  //the end animate menu function Call

  //add switch-button for children ul
  link.append(function(indx, val){
      if($(this).parent('li').find('ul').length != 0)
        return buttonNextLevelHtml;
      else
        return ''
    });

  //add back-button
  menuList.prepend(buttonPrevLevelHtml)

  //var block-two
  var buttonNextLevel = $('.js-arrow'),
      buttonPrevLevel = $('.js-back');

  //view next level menu
  $(link.find(buttonNextLevel)).on("click", function(e){
    e.preventDefault();
    e.stopPropagation();
    $(this).parents('ul').addClass('close-list');
  });

  //view prev level menu to click "back" 
  buttonPrevLevel.on("click", function(){
    $(this).closest('ul.close-list').removeClass('close-list')
  });

  
})(jQuery, window, document);