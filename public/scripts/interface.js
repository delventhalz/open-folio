/* * * * * * * * * * * * * * * * * * * * * * * *
 *              GENERAL HELPERS                *
 * * * * * * * * * * * * * * * * * * * * * * * */

// Returns an array of all ids that match a class
var getIds = function(className) {
  if (className[0] !== '.') className = '.' + className;

  return Array.prototype.reduce.call($(className), function(ids, elem) {
      ids.push(elem.id); 
      return ids;
    }, []);
};

// Runs and empties a queue of functions stored in an array
var runFunctions = function(funcArray) {
  funcArray.reverse();
  var func;

  while ( func = funcArray.pop() ) {
    func();
  }
};

// Disappears and reappears changing content
var animateChange = function(hidden, done) {
  if (animating.now) {
    if (hidden) animating.hiddens.push(hidden);
    if (done) animating.dones.push(done);
    return;
  }

  animating.now = true;

  setTimeout(function() {
    $('.content').fadeOut(animating.inTime, function() {
      if (hidden) hidden();
      runFunctions( animating.hiddens );

      $('.content').fadeIn(animating.outTime, function() {
        if (done) done();
        runFunctions( animating.hiddens );
        runFunctions( animating.dones );
        animating.now = false;
      });
    });
  }, animating.delay);
};


/* * * * * * * * * * * * * * * * * * * * * * * *
 *             INTERFACE FUNCTIONS             *
 * * * * * * * * * * * * * * * * * * * * * * * */

var populateSceneSelect = function() {
  var anchorIds = $.makeArray(
    $('.anchor').map(function(index, anchor) {
    return $(anchor).attr('id');
    })
  );

  $('#scene-select>.dropdown-menu').children().remove();

  anchorIds.forEach(function(id) {
    var actNumbers = { I: '1', II: '2', III: '3', IV: '4', V: '5' };
    var act = actNumbers[ id.slice(0, id.length-1) ];
    var scene = id.slice(id.length-1);

    if (scene === '1') {
      $('#scene-select>.dropdown-menu')
      .append('<li><a href="#' + id + '" class="dropdown-header">Act ' + act + '</a></li>');
    }

    $('#scene-select>.dropdown-menu')
    .append('<li><a href="#' + id + '">Scene ' + scene + '</a></li>');
  });
};

// Sets a toggleable button(s) to on
var toggleOn = function(id) {
  if (Array.isArray(id)) {
    return id.forEach(function(id) {
      toggleOn(id);
    });
  }

  if (id[0] !== '#') id = '#' + id;

  if (!$(id).hasClass('active')) $(id).trigger('click');
};

// Sets toggleable button(s) to off
// Sets all to off if no id is specified
var toggleOff = function(id) {
  if (Array.isArray(id)) {
    return id.forEach(function(id) {
      toggleOff(id);
    });
  }

  if (!id) return toggleOff( getIds('.toggle') );

  if (id[0] !== '#') id = '#' + id;

  if ($(id).hasClass('active')) $(id).trigger('click');
};

var togglePreset = function(button, name) {
  if ( $(button).hasClass('active') ) return;

  // Animating this reloads page, so I sneak it in during later animations
  setTimeout(function() {
    $('.formatting').attr('href', styles[name].path);
  }, animating.delay + animating.inTime);

  toggleOff();
  toggleOn(styles[name].toggles);

  $('.preset').removeClass('active');
  $(button).addClass('active');
};


/* * * * * * * * * * * * * * * * * * * * * * * *
 *              STYLE FUNCTIONS                *
 * * * * * * * * * * * * * * * * * * * * * * * */

// Adds a style tag to the head if it does not exist.
var makeStyleTag = function (selector) {
  var type;

  if (!$(selector).length) {
    if (selector[0] === '.') type = 'class';
    else if (selector[0] === '#') type = 'id';
    else return;

    $('head').append('<style ' + type + '="' + selector.slice(1) 
      + '" type="text/css"></style>');
  }
};

// Toggles a particular CSS style on or off in the whole document
// Note that an off state must be provided in order to override existing styles
var toggleStyle = function (selector, style, on, off) {
  var id = '#' + selector.replace('.', '').replace('#', '') + '-' + style;
  makeStyleTag(id);

  animateChange(function() {
    if ($(selector).css(style) === on) {
      $(id).html(selector + '{' + style + ':' + off + ';}');
    } else {
      $(id).html(selector + '{' + style + ':' + on + ';}');
    }
  });
};

var toggleSizeStyle = function (selector, style, size) {
  var id = '#' + selector.replace('.', '').replace('#', '') + '-' + style;
  makeStyleTag(id);

  animateChange(function() {
    if ( $(selector).css(style).replace('px', '') > 0 ) {
      $(id).html(selector + '{' + style + ':0;}');
    } else {
      $(id).html(selector + '{' + style + ':' + size + ';}');
    }
  });
};

var setSceneVisibility = function() {
  if (!settings.displayAll && settings.scene) {
    $('.anchor').hide();
    $(settings.scene).show();
  } else {
    $('.anchor').show();
  }
};

var setDynamicText = function() {
  if ($(window).width() < settings.resizeWidth) {
    $('.folio').addClass('dynamic');
  } else {
    $('.folio').removeClass('dynamic');
  }
};


/* * * * * * * * * * * * * * * * * * * * * * * *
 *                 LISTENERS                   *
 * * * * * * * * * * * * * * * * * * * * * * * */

//Text resizing
setDynamicText();
$(window).on('resize', function() {
  setDynamicText();
});

// General Button Behavior
$('.toggle').on('click', function() {
  $(this).toggleClass('active');
});


// Play selection
$('#play-selection').autocomplete({
  lookup: plays,

  onSelect: function (suggestion) {
    animateChange(function() {
      $('.content').children().remove();
      $.get(suggestion.path, function(data) {
        $('.content').append(data);
        populateSceneSelect();
        if ( !$('.preset').hasClass('active') ) {
          $('#modern-preset').trigger('click');
        }
      });
    });
  }

});

$('#scene-select>.dropdown-menu').on('click', 'a', function() {
  settings.scene = $(this).attr('href');
  setSceneVisibility();
});

$('#display-box').on('click', function() {
  animateChange(function() {
    settings.displayAll = $(this).prop('checked');
    setSceneVisibility();
  });
});


// Presets
$('#modern-preset').on('click', function() {
  togglePreset(this, 'modern');
});

$('#original-preset').on('click', function() {
  togglePreset(this, 'original');
});

$('#night-preset').on('click', function() {
  togglePreset(this, 'night');
});


// Behaviors for the formatting buttons on the third row.
$('#font-smaller').on('click', function() {
  var fontSize = $('.folio').css('font-size').slice(0, -2);
  $('.folio').css('font-size', fontSize - 1);
});

$('#font-larger').on('click', function() {
  var fontSize = $('.folio').css('font-size').slice(0, -2);
  fontSize++; // No idea why, but fontSize must be incremented seperately.
  $('.folio').css('font-size', fontSize);
});

$('#line-spacing').on('click', 'li', function() {
  $('.folio').css( 'line-height', ($(this).text() * 100) + '%' );
});

$('#character-linebreak').on('click', function() {
  toggleStyle('.character', 'display', 'block', 'inline');
  toggleStyle('.char-stop', 'display', 'none', 'inline');
});

$('#character-caps').on('click', function() {
  toggleStyle('.character', 'text-transform', 'uppercase', 'none');
});

$('#character-bold').on('click', function() {
  toggleStyle('.character', 'font-weight', '800', '300');
});

$('#direction-linebreak').on('click', function() {
  toggleStyle('.direction', 'display', 'block', 'inline');
});

// TODO: Make dynamic with line-height is changed afterwards.
$('#paragraph-linebreak').on('click', function() {
  var height = $('.folio').css('line-height').replace('px', '');
  toggleSizeStyle('p', 'margin-top', height * 0.5 + 'px');
});

$('#punctuation-whitespace').on('click', function() {
  toggleSizeStyle('.major', 'margin-right', '1.5em');
});

// TODO: Make major punctuation bigger as well;
$('#punctuation-bold').on('click', function() {
  toggleStyle('.major', 'font-weight', '800', '300');
  toggleStyle('.minor', 'font-weight', '800', '300');
});

$('#line-numbers').on('click', function() {
  toggleStyle('.line-count', 'display', 'none', 'inline');
});

$('#syllable-numbers').on('click', function() {
  toggleStyle('.syllable-count', 'display', 'none', 'inline');
});
