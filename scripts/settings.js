// Object used to store a few runtime settings
var settings = {
  resizeWidth: 640,
  displayAll: $('#display-box').prop('checked')
};

// Animation settings
var animating = {
  now: false,
  delay: 150,
  inTime: 500,
  outTime: 1000,
  hiddens: [],
  dones: []
};

// Names and paths of plays for linking
var plays = [{
  value: 'All\'s Well That Ends Well', 
  path: 'plays/alls-well.html'
}, {
  value: 'Anthony and Cleopatra', 
  path: 'plays/anthony-cleopatra.html'
}, {
  value: 'As You Like It', 
  path: 'plays/as-you-like-it.html'
}, {
  value: 'Comedy of Errors', 
  path: 'plays/comedy-errors.html'
}, {
  value: 'Coriolanus', 
  path: 'plays/coriolanus.html'
}, {
  value: 'Cymbeline', 
  path: 'plays/cymbeline.html'
}, {
  value: 'Hamlet', 
  path: 'plays/hamlet.html'
}, {
  value: 'Julius Caesar', 
  path: 'plays/caesar.html'
}, {
  value: 'King Henry IV part 1', 
  path: 'plays/henry-4-1.html'
}, {
  value: 'King Henry IV part 2', 
  path: 'plays/henry-4-2.html'
}, {
  value: 'King Henry V', 
  path: 'plays/henry-5.html'
}, {
  value: 'King Henry VI part 1', 
  path: 'plays/henry-6-1.html'
}, {
  value: 'King Henry VI part 2', 
  path: 'plays/henry-6-2.html'
}, {
  value: 'King Henry VI part 3', 
  path: 'plays/henry-6-3.html'
}, {
  value: 'King Henry VIII', 
  path: 'plays/henry-8.html'
}, {
  value: 'King John', 
  path: 'plays/john.html'
}, {
  value: 'King Lear', 
  path: 'plays/lear.html'
}, {
  value: 'King Richard II', 
  path: 'plays/richard-2.html'
}, {
  value: 'King Richard III', 
  path: 'plays/richard-3.html'
}, {
  value: 'Love\'s Labor Lost', 
  path: 'plays/loves-labor.html'
}, {
  value: 'Macbeth', 
  path: 'plays/macbeth.html'
}, {
  value: 'Measure for Measure', 
  path: 'plays/measure.html'
}, {
  value: 'The Merchant of Venice', 
  path: 'plays/merchant.html'
}, {
  value: 'Merry Wives of Windsor', 
  path: 'plays/merry-wives.html'
}, {
  value: 'A Midsummer Night\'s Dream', 
  path: 'plays/midsummer.html'
}, {
  value: 'Much Ado About Nothing', 
  path: 'plays/much-ado.html'
}, {
  value: 'Othello', 
  path: 'plays/othello.html'
}, {
  value: 'Romeo and Juliet', 
  path: 'plays/romeo-juliet.html'
}, {
  value: 'Taming of the Shrew', 
  path: 'plays/taming.html'
}, {
  value: 'The Tempest', 
  path: 'plays/tempest.html'
}, {
  value: 'Timon of Athens', 
  path: 'plays/timon.html'
}, {
  value: 'Titus Andronicus', 
  path: 'plays/titus.html'
}, {
  value: 'Troylus and Cressida', 
  path: 'plays/troylus.html'
}, {
  value: 'Twelfth Night', 
  path: 'plays/twelfth-night.html'
}, {
  value: 'Two Gentlemen of Verona', 
  path: 'plays/two-gentlemen.html'
}, {
  value: 'Winter\'s Tale', 
  path: 'plays/winters-tale.html'
}];


// CSS location and button toggles for different presets
var styles = {

  modern: {
    path: 'styles/modern.css',
    toggles: [
      'direction-linebreak',
      'character-linebreak',
      'character-caps',
      'paragraph-linebreak',
      'punctuation-bold',
      'punctuation-whitespace',
      'line-numbers'
    ]
  },

  original: {
    path: 'styles/original.css',
    toggles: [
      /* All toggles off */
    ]
  },

  night: {
    path: 'styles/night.css',
    toggles: [
      'direction-linebreak',
      'character-linebreak',
      'character-caps',
      'paragraph-linebreak',
      'punctuation-bold',
      'punctuation-whitespace',
      'line-numbers',
      'syllable-numbers'
    ]
  }
};
