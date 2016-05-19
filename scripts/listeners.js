/* * * * * * * * * * * * * * * * * * * * * * * *
 *             GENERAL LISTENERS               *
 * * * * * * * * * * * * * * * * * * * * * * * */

// Text resizing
setDynamicText();
$(window).on('resize', function() {
  setDynamicText();
});

// General Button Behavior
$('.toggle').on('click', function() {
  $(this).toggleClass('active');
});


/* * * * * * * * * * * * * * * * * * * * * * * *
 *              TOP LINE BUTTONS               *
 * * * * * * * * * * * * * * * * * * * * * * * */

// Printing
$('#print-button').on('click', function() {
  window.print();
});

// Play selection
$('#play-selection').autocomplete({
  lookup: plays,

  onSelect: function(suggestion) {
    animateChange(function() {
      $('.content').children().remove();
      $('.content').append('<div class="folio">\n<h1 class="title">' + 
        suggestion.value + '</h1>\n</div>');
      $.get(suggestion.path, function(data) {
        $('.folio').append(data);
        populateSceneSelect();
        shiftDirections();
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
    settings.displayAll = $('#display-box').prop('checked');
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


/* * * * * * * * * * * * * * * * * * * * * * * *
 *            FORMATTING BUTTONS               *
 * * * * * * * * * * * * * * * * * * * * * * * */

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
  toggleStyle('.character', 'font-weight', '900', '400');
});

$('#direction-linebreak').on('click', function() {
  toggleStyle('.direction', 'display', 'block', 'inline');
});

// TODO: Make dynamic with line-height is changed afterwards.
$('#paragraph-linebreak').on('click', function() {
  var height = $('.folio').css('font-size').replace('px', '');
  toggleStyle('p', 'margin-top', height * 0.6 + 'px', '0px');
});

$('#punctuation-whitespace').on('click', function() {
  toggleStyle('.major', 'margin-right', '1.5em', '0px');
});

// TODO: Make major punctuation bigger as well;
$('#punctuation-bold').on('click', function() {
  toggleStyle('.major', 'font-weight', '900', '400');
  toggleStyle('.minor', 'font-weight', '900', '400');
});

$('#line-numbers').on('click', function() {
  toggleStyle('.line-count', 'display', 'none', 'inline');
});

$('#syllable-numbers').on('click', function() {
  toggleStyle('.syllable-count', 'display', 'none', 'inline');
});

/* * * * * * * * * * * * * * * * * * * * * * * *
 *               PRINT SETTINGS                *
 * * * * * * * * * * * * * * * * * * * * * * * */

$('#font-size').on('change', function() {
  console.log($(this).val());
})

