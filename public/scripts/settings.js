// Object used to store a few runtime settings
var settings = {};

// Animation settings
var animating = {
  now: false,
  delay: 200,
  inTime: 600,
  outTime: 1200,
  hiddens: [],
  dones: []
};

// Names and paths of plays for the autocomplete
var plays = [
  {
    value: "Hamlet", 
    path: "plays/hamlet.html"
  },

  {
    value: "Twelfth Night", 
    path: "plays/twelfth-night.html"
  },
  
  {
    value: "Winter's Tale", 
    path: "plays/winters-tale.html"
  }
];


// CSS location and button toggles for different presets
var styles = {

  modern: {
    path: 'styles/modern.css',
    toggles: [
      'direction-linebreak',
      'character-linebreak',
      'character-caps',
      'punctuation-bold',
      'punctuation-whitespace',
      'line-numbers'
    ]
  },

  original: {
    path: 'styles/original.css',
    toggles: [
      /* TODO */
    ]
  },

  night: {
    path: 'styles/night.css',
    toggles: [
      'direction-linebreak',
      'character-linebreak',
      'character-caps',
      'punctuation-bold',
      'punctuation-whitespace',
      'line-numbers',
      'syllable-numbers'
    ]
  }

};
