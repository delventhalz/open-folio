/* * * * * * * * * * * * * * * * * * * * * * * *
 *              GENERAL HELPERS                *
 * * * * * * * * * * * * * * * * * * * * * * * */

// Returns an array of all ids that match a class
var getIds = function(className) {
  if (className[0] !== '.') className = '.' + className;

  return Array.prototype.map.call($(className), function(element) {
      return element.id;
    });
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

// Move stage directions to after numbering. Semantically weird, but
// necessary for appearance when directions are given block display.
var shiftDirections = function() {
  Array.prototype.forEach.call($('.direction'), function(direction){
    var numbering = $(direction).next('.numbering')[0];
    if (numbering) $(direction).detach().insertAfter(numbering);
  });
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
    var act = actNumbers[ id.slice(0, -1) ];
    var scene = id.slice(-1);

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

  if (!id) return toggleOff( getIds('.navbar .toggle') );

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
var makeStyleTag = function(label) {
  var type = label[0] === '.' ? 'class' : 'id';

  if (!$(label).length) {
    $('head').append('<style ' + type + '="' + label.slice(1) 
      + '" type="text/css"></style>');
  }
};

var setStyle = function(label, tag) {
  makeStyleTag(label);
  $(label).html(tag);
};

var buildLabel = function(selector, style) {
  return selector.replace('.', '').replace('#', '').replace('@', '') + '-' + style;
};

var setPrintStyle = function(selector, style, value) {
  var label = '#print-' + buildLabel(selector, style);
  setStyle(label, '@media print {' + selector + '{' + style + ':' + value + ';} }');
};

// Toggles a particular CSS style on or off in the whole document
// Note that an off state must be provided in order to override existing styles
var toggleStyle = function(selector, style, on, off) {
  var label = '#' + buildLabel(selector, style);
  var value = $(selector).css(style) === off ? on : off;

  animateChange(function() {
    setStyle(label, selector + '{' + style + ':' + value + ';}');
  });
};

// Apply a unit to a number string if none already exists
var defaultUnit = function(num, unit) {
  num = num[0] === '.' ? 0 + num: num;
  num = isNaN( Number(num) ) ? num : num + unit;
  return num;
}

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
