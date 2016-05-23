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

// Load welcome content
loadWelcome();


/* * * * * * * * * * * * * * * * * * * * * * * *
 *              TOP LINE BUTTONS               *
 * * * * * * * * * * * * * * * * * * * * * * * */

// Back to home page
$('#header-brand').on('click', function() {
  animateChange(function() {
    $('.formatting').attr('href', '');
    toggleOff();
    $('.preset').removeClass('active');

    loadWelcome();
  });
});

// Play selection
$('#play-selection').autocomplete({
  lookup: plays,

  onSelect: function(suggestion) {
    animateChange(function() {
      loadContent(suggestion.path, suggestion.value);
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
 *                PRINT MODAL                  *
 * * * * * * * * * * * * * * * * * * * * * * * */

$('#font-size').on('change', function() {
  var val = defaultUnit($(this).val(), 'pt');
  $(this).val(val);

  setPrintStyle('.folio', 'font-size', val);
});

$('#line-height').on('change', function() {
  var val = defaultUnit($(this).val(), '');
  $(this).val(val);

  setPrintStyle('.folio', 'line-height', val);
});

$('#one-column').on('click', function() {
  $('#two-columns').removeClass('active');
  $('#column-gutter').prop('disabled', true);

  $('#print-columns').html('');
});

$('#two-columns').on('click', function() {
  $('#one-column').removeClass('active');
  $('#column-gutter').prop('disabled', false);

  setStyle('#print-columns', 
    '@media print{' + 
      '.folio{' + 
        '-webkit-column-count:2;' + 
        '-moz-column-count:2;' + 
        'column-count:2;' + 
      '}' + 
    '}'
  );
});

$('#column-gutter').on('change', function() {
  var val = defaultUnit($(this).val(), 'in');
  $(this).val(val);

  setStyle('#print-column-gap', 
    '@media print{' + 
      '.folio{' + 
        '-webkit-column-gap:' + val + ';' + 
        '-moz-column-gap:' + val + ';' + 
        'column-gap:' + val + ';' + 
      '}' + 
    '}'
  );
});

$('#top-margin').on('change', function() {
  var val = defaultUnit($(this).val(), 'in');
  $(this).val(val);

  setPrintStyle('@page', 'margin-top', val);
});

$('#bottom-margin').on('change', function() {
  var val = defaultUnit($(this).val(), 'in');
  $(this).val(val);

  setPrintStyle('@page', 'margin-bottom', val);
});

$('#left-margin').on('change', function() {
  var val = defaultUnit($(this).val(), 'in');
  $(this).val(val);

  setPrintStyle('@page', 'margin-left', val);
});

$('#right-margin').on('change', function() {
  var val = defaultUnit($(this).val(), 'in');
  $(this).val(val);

  setPrintStyle('@page', 'margin-right', val);
});

$('#go-to-print').on('click', function() {
  $('#print-modal').modal('hide');
  window.print();
});
