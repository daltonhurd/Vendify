/*
* Sticky Navbar functions
*/
(function($) {

  var scrolled = false,
      lst = 0,
      delta = 100,
      mPT = parseInt($('main').css('border-top-width'));

  $(window).scroll(function() {
    scrolled = true;
  });

  setInterval(function() {
    if ( scrolled ) {
      adjustNav();
      scrolled = false;
    }
  }, 250);

  var adjustNav = function() {
    var st = $(document).scrollTop(),
        wh = $(window).height(),
        hdr = $('.header');

    // make sure they scroll more than the delta
    if ( Math.abs(lst - st) <= delta ) {
      return;
    }

    if ( st > wh ) {
      if ( !hdr.hasClass('sticky') ) {
        hdr.addClass('sticky no-animation');
        setTimeout(function() {
          hdr.removeClass('no-animation');
        }, 100);
      }
    } else if ( st < mPT ) {
      console.log('Quitting');
      hdr.removeClass('sticky');
    }
    if ( st < lst && st > mPT && hdr.hasClass('sticky') ) {
      hdr.addClass('nav-down');
    } else {
      hdr.removeClass('nav-down');
    }
    lst = st;
  };

})(jQuery);


/* set width of full width hero image */
(function($) {

  /*
  * Adjust Hero Image Widths
  * Viewport Width - Content Width / 2 = Amount to extend the Slider
  */
  var adjustSlider = function() {
    pageWidth = $(window).width();
      sliderRelativeWidth = 43.10344827586207;
      sliderRelativeHeight = 95.97;
      contentWidth = $('.hero .wrap').width();
      contentPad = Math.floor(( pageWidth / 2 ) - ( contentWidth / 2 ));
      sliderWidth = Math.floor(contentWidth * sliderRelativeWidth / 100);
      cntWidth = sliderWidth + contentPad;
    if ( pageWidth > 560 ) {
      $('.hero-slides').css({
          'width': cntWidth,
          'margin-right': '-'+contentPad+'px'
      });
      $('.slides').css({
        'height': Math.ceil(cntWidth * sliderRelativeHeight / 100) + 56
      });
    } else {
      $('.hero-slides').css({
        'width': 'auto',
        'margin-right': 0
      });
      $('.slides').css({
        'height': Math.round(contentWidth * sliderRelativeHeight / 100) + 56
      });
    }
  }
  adjustSlider();
  $(window).resize(function() { adjustSlider(); });


  /* Edit Products */
  var setHalfPageWidth = function() {
    pageWidth = $(window).width();
    if ( pageWidth > 560 ) {
      contentWidth = $('.product-editor-demo').find('.wrap').width();
      contentPad = Math.floor(( pageWidth / 2 ) - ( contentWidth / 2 ));
      $('.editor-preview').css({
        'width': contentWidth + contentPad,
        'margin-right': '-'+contentPad+'px'
      });
    }
  };
  setHalfPageWidth();
  $(window).resize(function() { setHalfPageWidth(); });

  /* Adjust Features Logo Widths */
  var adjustFeaturesLogoContainer = function() {
    pageWidth = $(window).width();
    if ( pageWidth > 560 ) {
      intPreviewRelativeWidth = 39.6551724137931;
      contentWidth = $('.integrations').find('.wrap').width();
      contentPad = Math.floor(( pageWidth / 2 ) - ( contentWidth / 2 ));
      previewWidth = Math.floor(contentWidth * intPreviewRelativeWidth / 100);
      $('.int-preview').css({
        'width': previewWidth + contentPad,
        'margin-left': '-'+contentPad+'px'
      });
    }
  }
  adjustFeaturesLogoContainer();
  $(window).resize(function() { adjustFeaturesLogoContainer(); });

})(jQuery);


/* Hero Slider */
(function($) {

  /* Ready first slide */
  $(window).bind('load', function() {
    setTimeout(function() {
      $('.hero-slides').removeClass('pending-ready');
    }, 200);
  });

  var sliderLocked = 0;
  var texts = [ 'digital goods', 'handcrafted', 'food delivery' ];

  var type = function(text, i) {
    if ( i < text.length ) {
      $('.hero').find('.line-1')
        .html( text.substring(0, i + 1) );
      setTimeout(function() {
        type(text, i+1);
      }, 80);
    }
  }

  var omit = function(del, add, i) {
    if ( i <= del.length ) {
      $('.hero').find('.line-1')
        .html( del.substring(0, del.length - i) );
      setTimeout(function() {
        omit(del, add, i+1);
      }, 25);
    } else {
      if ( curText > 0 ) {
        type(add, 0);
      }
    }
  }

  var curText = 0;
  // if first one then add
  // if next of first one then remove first then add
  // if the last one, then remove and add
  var typeWriter = function(dir) {
    if ( dir == 'next' && curText < texts.length ) {
      // need to call simply add for the first time
      if ( curText < 1 ) {
        type(texts[curText], 0);
      } else {
        // and first omit then add afterwards
        omit(texts[curText - 1], texts[curText], 0);
      }
      curText += 1;
    } else if ( dir == 'prev' && curText > 0 ) {
      // moving to first slide
      // omit the text
      curText -= 1;
      omit(texts[curText], texts[curText - 1], 0);
    }
  }

  var resetHeroSliderClass = function(n) {
    $('.hero').removeClass().addClass('hero slide-'+n);
  }

  var swapNext = function() {
    $('.slides').find('li.sc').each(function() {
      slide = $(this);
      var n = 1;
      if ( slide.next('li').length ) {
        slide.removeClass('sc sn').addClass('sp')
          .next().addClass('sc');
        typeWriter('next');
        n = slide.next().index() + 1;
      } else {
        $('.slides').find('li').removeClass()
          .filter(':first').addClass('sc').nextAll().addClass('sn');
          n = 1;
          // Resetting the texts to default
          omit(texts[curText - 1], '', 0);
          curText = 0;
      }
      resetHeroSliderClass(n);
    });
  };
  var swapPrev = function() {
    $('.slides').find('li.sc').each(function() {
      slide = $(this);
      var n = 1;
      if ( slide.prev('li').length ) {
        slide.removeClass('sc sp').addClass('sn')
          .prev().addClass('sc');
        typeWriter('prev');
        n = slide.prev().index() + 1;
      } else {
       $('.slides').find('li').removeClass()
         .filter(':last').addClass('sc').prevAll().addClass('sp');
         n = $('.slides').find('li').length;
         // Resetting the texts to default
         type(texts[texts.length - 1], 0);
         curText = texts.length;
     }
     resetHeroSliderClass(n);
    });
  };

  var callNext = function() {
    if ( !sliderLocked ) {
      swapNext();
      sliderLocked = 1;
      setTimeout(function() { sliderLocked = 0; }, 1000);
      arBtn('next');
    }
  }

  var callPrev = function() {
    if ( !sliderLocked ) {
      swapPrev();
      sliderLocked = 1;
      setTimeout(function() { sliderLocked = 0; }, 1000);
      arBtn('prev');
    }
  }

  var arBtn = function(btn) {
    var act = $('.hs-radios').find('.active');
    if ( btn == 'next' ) {

      if ( act.is('li:last-child') ) {
        act.removeClass('active');
        $('.hs-radios').find('li').first().addClass('active');
      } else {
        act.removeClass('active').next().addClass('active');
      }

    } else if ( btn == 'prev' ) {

      if ( act.is('li:first-child') ) {
        act.removeClass('active');
        $('.hs-radios').find('li').last().addClass('active');
      } else {
        act.removeClass('active').prev().addClass('active');
      }

    }
  };

  $('.slide-btns').find('.prev').click(function() {
    callPrev();
  });

  $('.slide-btns').find('.next').click(function() {
    callNext();
  });

  /*
  * Radio Button calls
  */
  $('.hs-radios').find('li').click(function() {
    var btn = $(this);
    if ( !btn.hasClass('active') && !sliderLocked ) {
      if ( btn.is('li:first-child')
            && $('.hs-radios').find('.active').is('li:last-child') ) {
        // call next
        callNext();
      } else if ( btn.is('li:last-child')
                    && $('.hs-radios').find('.active').is('li:first-child') ) {
        // call prev
        callPrev();
      } else if ( btn.prev().hasClass('active') ) {
        // call next
        callNext();
      } else if ( btn.next().hasClass('active') ) {
        // call prev
        callPrev();
      }
    }
  });

})(jQuery);



/* FAQ Accordion */
(function($) {

  $('.accordion').find('li:not(.active)').find('div').slideUp('200');

  $('.accordion').find('li').click(function() {
    $target = $(this);
    if ( !$target.hasClass('active') ) {
      $('.accordion').find('li').removeClass('active color-texts').find('div').slideUp('200');
      $target.addClass('active').find('div').slideDown('200', function() {
        $target.addClass('color-texts');
      });
    }
  });

})(jQuery);


/* Sloto Machine - Demos  */
(function($) {

  /*
  * Slider Mode
  */
  var sloto;
  var setSloto = function() {
    if ( $(window).width() > 560 ) {
      sloto = 1;
    } else {
      sloto = 0;
    }
  };
  setSloto();

  /*
  * Handle details of each sloto (/demo) item.
  */
  var swapDetails = function(n) {
    $('.demos-details').find('li').removeClass('active').css('opacity',0)
        .filter(function(i) {
          return i === (n-1) && $(this).data('pd-details') === n;
        }).addClass('active').fadeTo(1,1);
  }

  /*
  * Add a copy of first and last cards
  * in reverse order for rollodex effect.
  */
  var swapCard = function(card) {
    if ( card == 'first' ) {
      // swapping the first card as last one
      $('.demos-list').find('li').first().appendTo('.demos-list ul');
    } else {
      // swapping the last card as first one
      $('.demos-list').find('li').last().prependTo('.demos-list ul');
    }
  };

  var resizeSloto = function() {
    wW = $(window).width();
    if ( wW > 560 ) {
      var hP = 111.11,
          sW = $('.demos-list').width(),
          cM = 30;
      // set sloto height
      // calculate a single cards height from the width
      // add two cards height + bottom margin/gap
      sHeight = Math.round(((sW / 100) * hP) * 2 + (cM * 2));
      $('.demos-list').height(sHeight);
    }
  };

  var init = function() {
    var fCard = $('.demos-list').find('li').removeClass('active')
                  .filter(function(i) {
                    return $(this).data('pd-prev') === 1;
                  }).addClass('active');
    swapCard('last');
    if ( sloto ) {
      var cH = fCard.outerHeight() + 15;
      $('.demos-list').find('ul').css('top', '-'+ Math.round(cH / 2) +'px');
    } else {
      var dlW = $('.demos-list').outerWidth();
      var cW = fCard.outerWidth();
      var dlL = cW - Math.round((dlW - cW) / 2) + 20;
      $('.demos-list').find('ul').css('left', '-'+ dlL +'px');
    }
    resizeSloto();
  };
  init();

  var resetCards = function() {
    var cHeight = $('.demos-list').find('li').removeClass('active').first().height();
    $('.demos-list').find('li').each(function(i) {
      var card = $(this);
      if ( card.data('pd-prev') == 1 ) {
        card.addClass('active');
      } else if ( card.data('pd-prev') == 2 ) {
        card.insertAfter( $('.demos-list').find('li[data-pd-prev="1"]') );
      } else if ( card.data('pd-prev') == 3 ) {
        card.insertAfter( $('.demos-list').find('li[data-pd-prev="2"]') );
      } else {
        card.insertBefore( $('.demos-list').find('li[data-pd-prev="1"]') );
      }
    });
    moveCards( $('.demos-list').find('ul'), '-' + Math.round((cHeight / 2) + 15)  );
    resizeSloto();
    swapDetails(1);
  };

  var roll = function() {
    var cardList = $('.demos-list').find('ul'),
        card = cardList.find('.active'),
        cP = sloto ? parseInt(cardList.css('top'))
                    : parseInt(cardList.css('left'));

    // moving downwards
    card.removeClass('active');
    cM = sloto  ? card.outerHeight() + 15
                : card.outerWidth() + 20;

    if ( card.nextAll().length < 2 ) {
      // This is the last card
      // Reshuffle on subsequent calls
      cP = -(Math.abs(cP) - cM);
      // setting the cardlist top to default position
      // to prepare it for slideUp and temoporarily stopping animation
      cardList.removeClass('animateable');
      moveCards(cardList, cP);
      //Moving the top/first card to the very last
      swapCard('first');
      // re-enabling the animaiton and Slideing-Up
      // the cardList position
      setTimeout(function() {
        cardList.addClass('animateable');
        moveCards(cardList, cP - cM);
      }, 1);

    } else {
      // and Sliding-Up the cardList
      moveCards(cardList, cP - cM);
    }

    // adding the active class and swaping the related card details
    card.next().addClass('active');

  }

  var slotoLocked = 1;
  var unlockSloto = function() {
    setTimeout(function() {
      slotoLocked = 0;
    }, 250);
  }

  // start the first then resend to the same function
  // if there's still another moveable card
  // then follow the same step
  // if this is the last one then- cancel the cycle
  var makeRoll = function(n, i) {
    if ( i < n ) {
      roll();
      setTimeout(function() {
        makeRoll(n, i+1);
      }, 250);
    } else {
      // Fading in demo details
      $('.demos-list').removeClass('not-ready');
      swapDetails(1);
      unlockSloto();
    }
  }

  var moveCards = function(cards, n) {
    if ( sloto ) {
      cards.css('top', n + 'px');
    } else {
      cards.css('left', n + 'px');
    }
  }

  $('.demos-list').find('li').click(function() {
    var card = $(this);
    var cardList = $('.demos-list').find('ul');
    var cP = sloto  ? parseInt(cardList.css('top'))
                    : parseInt(cardList.css('left'));

    if ( !card.hasClass('active') && !slotoLocked ) {

      slotoLocked = 1;

      if ( card.prev('li').hasClass('active') ) {

        // moving downwards or leftwards
        card.prev('li').removeClass('active');
        cM = sloto  ? card.prev('li').outerHeight() + 15
                    : card.prev('li').outerWidth() + 10;

        if ( !card.next().length ) {
          // This is the last card
          // Reshuffle on subsequent calls
          cP = -(Math.abs(cP) - cM);
          // setting the cardlist top to default position
          // to prepare it for slideUp and temoporarily stopping animation
          cardList.removeClass('animateable');
          moveCards(cardList, cP);
          //Moving the top/first card to the very last
          swapCard('first');
          // re-enabling the animaiton and Slideing-Up
          // the cardList position
          setTimeout(function() {
            cardList.addClass('animateable');
            moveCards(cardList, cP - cM);
          }, 1);

        } else {
          // and Sliding-Up the cardList
          moveCards(cardList, cP - cM);
        }

      } else if ( card.next('li').hasClass('active') ) {

        // clicked the top one and moving downwards or rightwards
        card.next('li').removeClass('active');
        cM = sloto  ? card.next('li').outerHeight() + 15
                    : card.next('li').outerWidth() + 10;

        if ( !card.prev().length ) {
          // This is the first card
          // moving the last card to top
          swapCard('last');
          cP = -(Math.abs(cP) + cM);
          // temporarily stopping animation and resetting cardList top
          cardList.removeClass('animateable');
          moveCards(cardList, cP);
          // re-enabling animation and Sliding-Up the cardList
          setTimeout(function() {
            cardList.addClass('animateable');
            moveCards(cardList, cP + cM);
          }, 1);

        } else {
          // and sliding down cardList
          moveCards(cardList, cP + cM);
        }

      }
      // adding the active class and swaping the related card details
      card.addClass('active');
      swapDetails(card.data('pd-prev'));
      unlockSloto();
    }
  });

  /*
  * Starting the demo slider on current scroll position
  */
  var startedDemoSlider = false;

  $(window).resize(function() {
    setSloto();
    if ( startedDemoSlider ) {
      resetCards();
    }
  });

  $(window).scroll(function() {
    wW = $(window).width();
    if ( !startedDemoSlider && $('.product-demos').length ) {
      sp = $(document).scrollTop();
      off = $('.product-demos').offset();
      pdT = Math.round(off.top);
      wH = $(window).height();
      if ( wW > 560 ) {
        if ( sp >= (pdT - (wH / 7)) ) {
          $('.demos-list').addClass('not-ready');
          makeRoll($('.demos-list').find('ul').find('li').length, 0);
          startedDemoSlider = true;
        }
      } else if ( wW < 560 && !startedDemoSlider ) {
        swapDetails(1);
        unlockSloto();
        startedDemoSlider = true;
      }
    }
  });

})(jQuery);


/*
* Features list
*/
(function($) {

  var positionedFeatures = false;

  $(window).scroll(function() {
    wW = $(window).width();
    if ( $('.features').length ) {
      sp = $(document).scrollTop();
      off = $('.features').offset();
      ssT = Math.round(off.top);
      wH = $(window).height();
      diff = (wW > 560) ? ssT - (wH / 4) : ssT ;
      if ( !positionedFeatures && sp >= diff ) {
        $('.features').removeClass('not-ready');
        positionedFeatures = true;
      }
    }
  });

})(jQuery);


/*
* Seller Suite
*/
(function($) {

  var positionedSellerSuite = positionedBubble = false;

  $(window).scroll(function() {
    wW = $(window).width();
    if ( (!positionedSellerSuite || !positionedBubble)
          && $('.seller-suite').length ) {
      sp = $(document).scrollTop();
      off = $('.seller-suite').offset();
      ssT = Math.round(off.top);
      wH = $(window).height();
      diff = (wW > 560) ? ssT : ssT - (wH / 3) ;
      if ( !positionedSellerSuite && sp >= diff ) {
        $('.seller-suite').removeClass('not-ready');
        positionedSellerSuite = true;
      }
      if ( wW > 560 ) {
        if ( !positionedBubble && sp >= (ssT + (wH / 4)) ) {
          $('.seller-suite').addClass('bbl-delay').removeClass('no-bubble');
          positionedBubble = true;
          setTimeout(function() {
            $('.seller-suite').removeClass('bbl-delay');
          }, 1000);
        }
      }
    }
  });

  /* Toggle Item Switcher */
  $('.toggle-btns').find('button').click(function() {
    btn = $(this);
    if ( !btn.hasClass('active') ) {
      btn.addClass('active').siblings().removeClass('active');
      $('.toggle-item').eq(btn.index()).addClass('active')
        .siblings().removeClass('active');
    }
  });

  /* Tooltips */
  $('.tooltips').find('li').click(function() {
    ttItem = $(this);
    if ( !ttItem.hasClass('active') ) {
      ttItem.addClass('active').siblings().removeClass('active');
    }
  });

  $('.tooltip').find('button').click(function(e) {
    btn = $(this);
    item = btn.parents('li');
    if ( item.next().length ) {
      item.removeClass('active').next().addClass('active');
    }
    e.stopPropagation();
  });

})(jQuery);


/*
* Sales Management
*/
(function($) {

  var setEventList = function() {
    $('.event-item').each(function(i) {
      var that = this;
      var t = setTimeout(function() {
        $(that).removeClass('squeeze');
      }, 100 * i);
    });
  };

/*
0. Current Scroll Position
1. Section Content Height
2. Content Pad in relation with Window Height

if Current Scroll Position is equal to or greater than
the Section Top + Content Height + ContentWindowPad
*/

  /*
  * Initializing based on scrolling position
  */
  var addedEventList = false;

  $(window).scroll(function() {
    var wW = $(window).width();
    if ( $('.sales-management').length && !addedEventList ) {
      scrollPos = $(document).scrollTop();
      sellerSuite = $('.sales-management').offset();
      if ( scrollPos >= Math.round(sellerSuite.top) ) {
        setEventList();
        addedEventList = true;
        if ( wW > 560 ) {
          setTimeout(animateUI, 1000);
        }
      }
    }
  });

  var animateUI = function() {
    var c = $('.evt-cursor');

    // step 1
    // move to dropdown position
    c.addClass('cto-position');

    // activate the first one
    // deactivate the second
    // and activate the second one
    setTimeout(function() {
      $('.event-item').eq(0).addClass('active');
      setTimeout(function() {
        $('.event-item').eq(0).removeClass('active');
        $('.event-item').eq(1).addClass('active');
        $('.event-item').eq(2).addClass('active');
        setTimeout(function() {
          $('.event-item').eq(1).removeClass('active');
          setTimeout(function(){
            $('.event-item').eq(2).addClass('on-evt-list');
          }, 150);
        }, 250);
        setTimeout(function() {
          callComplete();
        }, 1000);
      }, 150);
    }, 150);

  }

  var preCall = function() {
    $('.evt-cursor').attr('class', 'evt-cursor cto-position');
    setTimeout(function() {
      $('.event-item').eq(2).addClass('active');
      setTimeout(function() {
        setTimeout(function(){
          $('.event-item').eq(2).addClass('on-evt-list');
          callComplete();
        }, 150);
      }, 500);
    }, 250);
  }

  var callComplete = function() {
    // move cursor to the right place
    // then call the 'complete' label.
    var c = $('.evt-cursor');
    c.attr('class', 'evt-cursor ctc-position');
    setTimeout(function() {
      $('.evt-ic-complete').addClass('active');
      setTimeout(function() {
        $('.event-item').eq(2).addClass('evt-status');
        setTimeout(function() {
          $('.evt-ic-complete').removeClass('active');
          delComplete($('.event-item').eq(2));
        }, 1000);
      }, 350);
    }, 500);
  };

  var delComplete = function(item) {
    var listHeight = $('.list-event').height();
    $('.list-event').height(listHeight);
    item.slideUp(350, function() {
      item.removeClass('evt-status on-evt-list active');
      setTimeout(function() {
        readdComplete(item);
      }, 250);
    });
  };

  var readdComplete = function(item) {
    item.addClass('readd animate');
    $('.list-event').append(item);
    setTimeout(function() {
      item.show().removeClass('animate');
      setTimeout(function() {
        item.removeClass('readd').insertAfter($(".event-item").eq(1));
        $('.list-event').css('height', 'auto');
        callProcessing();
      }, 150);
    }, 250);
  };

  var callProcessing = function() {
    var c = $('.evt-cursor');
    $('.event-item').eq(3).addClass('active');
    c.attr('class', 'evt-cursor ctp-position-b');
    setTimeout(function() {
      $('.event-item').eq(3).addClass('on-evt-list');
      setTimeout(function() {
        c.attr('class', 'evt-cursor ctp-position');
        setTimeout(function() {
          $('.evt-ic-processing').addClass('active');
          setTimeout(function() {
            $('.event-item').eq(3).addClass('evt-status');
            setTimeout(function() {
              $('.evt-ic-processing').removeClass('active');
              delProcessing($('.event-item').eq(3));
            }, 1000);
          }, 350);
        }, 350);
      }, 250);
    }, 500);
  };

  var delProcessing = function(item) {
    var listHeight = $('.list-event').height();
    $('.list-event').height(listHeight);
    item.slideUp(350, function() {
      item.removeClass('evt-status on-evt-list active');
      setTimeout(function() {
        readdProcessing(item);
      }, 250);
    });
  };

  var readdProcessing = function(item) {
    item.addClass('readd animate');
    $('.list-event').append(item);
    setTimeout(function() {
      item.show().removeClass('animate');
      setTimeout(function() {
        item.removeClass('readd').insertAfter($(".event-item").eq(2));
        $('.list-event').css('height', 'auto');
        callDelete();
      }, 150);
    }, 250);
  };

  var callDelete = function() {
    var c = $('.evt-cursor');
    $('.event-item').eq(4).addClass('active');
    c.attr('class', 'evt-cursor ctd-position-b');
    setTimeout(function() {
      $('.event-item').eq(4).addClass('on-evt-list');
      setTimeout(function() {
        c.attr('class', 'evt-cursor ctd-position');
        setTimeout(function() {
          $('.evt-ic-delete').addClass('active');
          setTimeout(function() {
            $('.event-item').eq(4).addClass('evt-status');
            setTimeout(function() {
              $('.evt-ic-delete').removeClass('active');
            delDelete($('.event-item').eq(4));
            }, 1000);
          }, 350);
        }, 350);
      }, 250);
    }, 500);
  };

  var delDelete = function(item) {
    var listHeight = $('.list-event').height();
    $('.list-event').height(listHeight);
    item.slideUp(350, function() {
      item.removeClass('evt-status on-evt-list active');
      setTimeout(function() {
        readdDelete(item);
      }, 250);
    });
  };

  var readdDelete = function(item) {
    item.addClass('readd animate');
    $('.list-event').append(item);
    setTimeout(function() {
      item.show().removeClass('animate');
      setTimeout(function() {
        item.removeClass('readd').insertAfter($(".event-item").eq(3));
        $('.list-event').css('height', 'auto');
        preCall();
      }, 150);
    }, 250);
  };

  /* Preventing clicks */
  $('.list-event').click(function() {
    return false;
  });

})(jQuery);


/*
* Integration Parallax
*/
(function($) {

  $(window).scroll(function() {

    if ( $('.integrations').length && $(window).width() > 560 ) {
      var sp = $(document).scrollTop(); // Current Scroll Position
      var off = $('.integrations').offset();
      var st = Math.round(off.top); // Integration Top Position
      var sh = $('.integrations').outerHeight(); // Section Total Height
      var sch = $('.integrations').height(); // Section Content Height

      if ( sp < (st + sch) ) {
        if ( sp > (st - sh) && sp < (st + 100) ) {
          var n = 200 - ((sp + 100) - st);
          $('.set-0').css({ 'transform' : 'translateY('+ n/3 +'px)' });
          $('.set-1').css({ 'transform' : 'translateY('+ n/4 +'px)' });
          $('.set-2').css({ 'transform' : 'translateY('+ n/5 +'px)' });
          $('.set-3').css({ 'transform' : 'translateY('+ n/6 +'px)' });
          $('.set-4').css({ 'transform' : 'translateY('+ n/7 +'px)' });
        }
        if ( sp >= (st + 200) ) {
          var n = sp - (st + 200);
          if ( n <= 200 ) {
            $('.set-0').css({ 'transform' : 'translateY(-'+ n/3 +'px)' });
            $('.set-1').css({ 'transform' : 'translateY(-'+ n/4 +'px)' });
            $('.set-2').css({ 'transform' : 'translateY(-'+ n/5 +'px)' });
            $('.set-3').css({ 'transform' : 'translateY(-'+ n/6 +'px)' });
            $('.set-4').css({ 'transform' : 'translateY(-'+ n/7 +'px)' });
          }
        }
      }
    }

  });

})(jQuery);


/*
* Live Editor
*/
(function($) {

  /*
  * Initializing based on scrolling position
  */
  var positionedProductEditor = false;

  $(window).scroll(function() {
    if ( $('.product-editor-demo').length ) {
      sp = $(document).scrollTop(); //Current scrolling position
      pet = $('.product-editor-demo').offset();
      pet = pet.top; //Product Editor position relative to the Document
      peh = $('.product-editor-demo').outerHeight(); //Product Editor height
      sPad = 100;
      if ( !positionedProductEditor ) {
        if ( sp >= (pet - (peh / 6)) && sp < (pet + peh) ) {
          $('.product-editor-demo').removeClass('not-ready');
          positionedProductEditor = true;
          setTimeout(function() {
            $('.product-editor-demo').removeClass('transition-delay');
          }, 500);
        }
      } else if ( $(window).width() > 560 ) {
        if ( sp > pet && sp <= (pet + 240) ) {
          var n = (pet + 240) - sp;
          $('.editor-tool').css({ 'transform' : 'translateY('+ n/3 +'px)' });
          $('.editor-sidebar').css({ 'transform' : 'translateY('+ n/5 +'px)' });
        }
      }
    }
  });

})(jQuery);


/* Testimonials Slider */
(function($) {

  var addedEventList = false;

  $(window).scroll(function() {
    if ( $('.testimonials').length && !addedEventList ) {
      scrollPos = $(document).scrollTop();
      ww = $(window).width();
      wh = $(window).height();
      testi = $('.testimonials').offset();
      tt = (ww > 560) ? Math.round(testi.top - (wh / 2)) : Math.round(testi.top - wh );
      if ( scrollPos >= tt ) {
        $('.testimonials').removeClass('not-ready');
        addedEventList = true;
      }
    }
  });

  var sliderLocked = 0;

  var swapNext = function() {
    $('.testimonials').find('ul').find('li').filter('.active').each(function() {
      var item = $(this);
      if ( item.next().length ) {

        $('.testimonials').removeClass('testi-' + item.next().index());

        item.removeClass('active').next().addClass('active');

        if ( !(item.nextAll().length > 1) ) {
          $('.testimonials').find('.next').addClass('inactive');
        } else {
          $('.testimonials').find('.next').removeClass('inactive');
        }
        $('.testimonials').find('.prev').removeClass('inactive');
      }
    });
  };

  var swapPrev = function() {
    $('.testimonials').find('ul').find('li').filter('.active').each(function() {
      var item = $(this);
      if ( item.prev().length ) {
        item.removeClass('active').prev().addClass('active');

        if ( !(item.prevAll().length > 1) ) {
          $('.testimonials').find('.prev').addClass('inactive');
        } else {
          $('.testimonials').find('.prev').removeClass('inactive');
        }
        $('.testimonials').find('.next').removeClass('inactive');
      }
    });
  };

  $('.testimonials').find('.prev').click(function() {
    if ( !sliderLocked ) {
      swapPrev();
      sliderLocked = 1;
      setTimeout(function() { sliderLocked = 0; }, 300);
    }
  });

  $('.testimonials').find('.next').click(function() {
    if ( !sliderLocked ) {
      swapNext();
      sliderLocked = 1;
      setTimeout(function() { sliderLocked = 0; }, 300);
    }
  });

})(jQuery);


/*
* Pricing
*/
(function($) {

  $('#switch').change(function(e) {
    var s = $(this);
    if ( s.prop('checked') ) {
      $('.billing-period').find('.yearly')
        .addClass('active').siblings('.p-label').removeClass('active');
    } else {
      $('.billing-period').find('.p-label:not(.yearly)')
      .addClass('active').siblings('.p-label').removeClass('active');
    }
  });

  $('.p-label').click(function() {
    var label = $(this);
    if ( !label.hasClass('active') ) {
      label.addClass('active').siblings('span').removeClass('active');
      // if yearly has been cliecked
      if ( !label.hasClass('yearly')) {
        label.siblings('.toggle-switch').find(':input').prop('checked', false);
      } else {
        label.siblings('.toggle-switch').find(':input').prop('checked', true);
      }
    }
  });

})(jQuery);


/*
* Footer Coding
*/
(function($) {

  /*
  * Initializing based on scrolling position
  */
  var positionedFooterImage = false;

  $(window).scroll(function() {
    if ( !positionedFooterImage ) {
      scrollPos = $(document).scrollTop();
      docHeight = $(document).height();
      winHeight = $(window).height();
      if ( scrollPos >= (docHeight - (winHeight * 1.3)) ) {
        $('.footer').removeClass('not-ready');
        positionedFooterImage = true;
      }
    }
  });

})(jQuery);

/*
* Modals
*/
(function($) {

  /*
  * Calling newsletter modal on exit
  */
  ouibounce(null, {
    callback: function() {
      $('body').addClass('modal-ofr');
      $('.modal-offer').addClass('modal-on');
    }
  });

  $('.btn-modal-cls').click(function() {
    $('.modal-offer, .modal-success').removeClass('modal-on');
    setTimeout(function() {
      $('body').removeClass('modal-ofr modal-sccs');
    }, 250);
  });

})(jQuery);



/*
* Checkout page
*/
(function($) {

  /* Toggle Bubble Visibility */
  $('#cvc').focusin(function() {
    $(this).parents('li').addClass('show-bubble');
  }).focusout(function() {
    $(this).parents('li').removeClass('show-bubble');
  });

  /* Initiating Select2 */
  $(document).ready(function() {
    if ( $('#country').length ) {
      $('#country').select2();
    }
  });

  $(window).resize(function() {
    $('.select2.select2-container').css('width', '100%');
  });

})(jQuery);


/*
* Checkout Form Validation
*/
(function($) {
  /*
  * Adding Custom Visa and Master Card validation
  * with spaces after each four digits except the last one
  */
  window.Parsley.addValidator('creditCards', {
    requirementType: 'string',
    validateString: function(value, requirement) {
      cardReg = new RegExp("^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$");
      return cardReg.test(value.replace(/\s/g,''));
    },
    messages: { en: 'Please type a valid Visa or Master card number' }
  });

  /*
  * Automatially add spaces after each fourght number.
  * And accepts only numeric keys/values
  */
  $('#cardnumber').on('keypress change', function(e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57 )) {
      return false;
    } else {
      $(this).val(function(index, value) {
        if (value.length < 19 ) {
          return value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ');
        } else {
          return value;
        }
      });
    }
  });

  // Credit Card Date Validator
  window.Parsley.addValidator('ccDate', {
    requirementType: 'string',
    validateString: function(value, requirement) {
      ccDateReg = new RegExp("^([1-9]|0[1-9]|1[0-2])\/(1[8-9]|[2-9][0-9])$");
      return ccDateReg.test(value);
    },
    messages: {en: 'Please enter a valid expiry date.'}
  });


  /*
  * Automatially add spaces after each fourght number.
  * And accepts only numeric keys/values
  */
  $('#cvc').on('keypress change', function(e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57 )) {
      return false;
    }
  });

  var parsleyConfig = {
    errorsContainer: function(parsleyField) {
      var field = parsleyField.$element.parent();
      if ( field.length > 0) {
        return field;
      }
      return field;
    }
  };

  $('.checkout').find('form').parsley(parsleyConfig);

  /* Add Custom Classes to fields' parents */
  window.Parsley.on('field:error', function(ParsleyField) {
    ParsleyField.$element.parent().removeClass('validation-success').addClass('validation-error');
  });
  window.Parsley.on('field:success', function(ParsleyField) {
    ParsleyField.$element.parent().removeClass('validation-error').addClass('validation-success');
  });

  window.Parsley.on('form:error', function(ParsleyForm) {
    ParsleyForm.$element.find('.package-price').find('button').prop('disabled', true);
  });
  window.Parsley.on('form:success', function(ParsleyForm) {
    ParsleyForm.$element.find('.package-price').find('button').prop('disabled', false);
  });

  /*
  * validate
  */
  $('.package-price').find('.disabled-btn').click(function() {
    $('.checkout').find('form').parsley().validate();
  });
})(jQuery);

/*
* Newsletter Form Validation
*/
(function($) {

  $('.newsletter').find('form').parsley();
  $('.modal-offer').find('form').parsley();

  window.Parsley.on('field:error', function(ParsleyField) {
    ParsleyField.$element.parents('.btn-wrap').find('button').prop('disabled', true);
  });
  window.Parsley.on('field:success', function(ParsleyField) {
    ParsleyField.$element.parents('.btn-wrap').find('button').prop('disabled', false);
  });

})(jQuery);

(function($) {

  $('.newsletter').find('button').click(function(e) {
    e.stopPropagation();
  });

  $('.btn-wrap').click(function(e) {
    var btnW = $(this);
    if ( !btnW.hasClass('shake-it') && btnW.find('button').is(':disabled') ) {
      btnW.addClass('shake-it');
      setTimeout(function() {
        btnW.removeClass('shake-it');
      }, 1000);
      return false;
    } else {
      return;
    }
    e.stopPropagation();
  });

})(jQuery);
