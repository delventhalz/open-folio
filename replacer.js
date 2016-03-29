// Load libraries.
var fs = require('fs');
var check = require('spellchecker');
var readline = require('readline-sync');

// Useful file paths.
var path = {
  defTarget: __dirname + '/target.txt',
  cipher: __dirname + '/words/cipher.json',
  ignore: __dirname + '/words/ignore.json',
  names: __dirname + '/words/names.json'
};

// Load JSON objects.
var cipher = require(path.cipher);
var ignore = require(path.ignore);
var names = require(path.names);


// Extras characters to count as parts of words.
var extras = {
  "'": true,
  '-': true
};

var vowels = {
  a: true,
  e: true,
  i: true,
  o: true,
  u: true,
  y: true
};

// Letters that were commmonly switched by printers.
var switches = {
  u: 'v',
  v: 'u',
  i: 'j',
  j: 'i'
};

var nth = {
  1: 'First ',
  2: 'Second ',
  3: 'Third ',
  4: 'Fourth ',
  5: 'Fifth '
};

// Skip object works like ignore, but is not saved to disk.
var skip = {};

// Counters
var wordCount = 0,
changeCount = 0,
cipherCount = 0,
lineCount = 1,
actCount = 0;

// Global variables for currently processed text and line.
var currentText = [];
var currentLine = 0;
var formattedText =[];


// Format a string line by line.
var format = function(string) {
  var newLine = true;

  currentText = string.split('\n');
  newText = [];

  for (currentLine = 0; currentLine < currentText.length; currentLine++) {
    var line = currentText[currentLine];
    console.log(line);

    if (line[0] + 0 > 0) {
      line = line.slice(7);
      var result = formatLine(line, newLine);
      formattedText.push(result.formatted);
      if (result.isLine) lineCount++;
      newLine = result.isEnd;
    }
  }

  return '<div class="text">\n' + formattedText.join('\n') + '\n</div>\n</div>';
};


// Format a line.
var formatLine = function(line, isStart) {
  var letter = word = closeTag = formatted = '';
  var i = syllables = closeCount = wordStart = 0;
  var isEnd = inWord = inTag = inChar = false;
  var isLine = true;

  var poetry = isPoetry();

  /****** Routing Object to write HTML Formatting ******/
  var html = {

    '.': function() {
      if (inChar) {
        formatted += '<span class="char-stop">' + letter + '</span>';
      } else if (!inTag) {
        if (i+1 === line.length) {
          formatted += '<span class="end-stop major">' + letter + '</span>';
          isEnd = true;
        } else {
          formatted += '<span class="mid-stop major">' + letter + '</span>';
        }
      } else {
        formatted += letter;
      }
    },

    '!': function() { html['.'](); },

    '?': function() { html['.'](); },

    ':': function() {
      if (!inTag) {
        formatted += '<span class="colon major">' + letter + '</span>';
      } else {
        formatted += letter;
      }
    },

    ';': function() { html[':'](); },

    ',': function() {
      if (!inTag) {
        formatted += '<span class="comma minor">' + letter + '</span>';
      } else {
        formatted += letter;
      }
    },

    '(': function() {
      if (!inTag) {
        formatted += '<span class="paren minor">' + letter + '</span>';
      } else {
        formatted += letter;
      }
    },

    ')': function() { html['('](); },

    '{': function() { formatted += '<em>'; },

    '}': function() { formatted += '</em>'; },

    '<': function() {

      var openRoute = {

        'Z': function() {

          if (line[i+3] === 'F' || line[i+4] === 'F') {
            formatted += '<div class="finis"';
            closeTag = '</div>';

            if (currentLine > currentText.length - 5) {
              formatted += ' id="end">';
            } else {
              formatted += '>';
            }

          } else if (line[i+3] === 'S' || line[i+4] === 'S') {
            formatted += '</div>\n<div ' + getId(line.slice(i+9)) + '><h3 class="anchor scene">';
            closeTag = '</h3>';

          } else if (line[i+3] === 'A' || line[i+4] === 'A') {
            if (actCount !== 0) formatted += '</div>\n';
            actCount++;
            formatted += '<div ' + getId(line.slice(i+9)) + '><h2 class="anchor act">';
            closeTag = '</h2>';
          } else {
            formatted += '<div class="unknown-header">';
            closeTag = '</div>';
          }

          lineCount = 1;
        },

        'D': function() {
          formatted += '<span class="direction">';
          closeTag = '</span>';
        },

        'S': function() {
          formatted += '<span class="character">';
          closeTag = '</span>';
          inChar = true;

          if (nth[line[i+3]]) {
            if(line[i+5] === '{') {
              formatted += '<em>' + nth[line[i+3]];
              i += 3;
            } else {
              formatted += nth[line[i+3]];
              i += 2;
            }
          }
        }
      };

      try {
        openRoute[line[i+1]]();
      } catch (e) {
        throw 'Unknown "<" route: "' + line[i] + '": ' + line + '\n' + e;
      }
      inTag = true;
      i += 2;
    },

    '>': function() { 
      formatted += closeTag; 
      closeCount++; 
      inTag = false;
      inChar = false;
    },

    '=': function() {
      formatted += '--';
      i+=2;
    },

    '&': function() { formatted += letter; },

    ' ': function() { html['&'](); },

    '|': function() { i++; },

    '#': function() {},

    '[': function() {},

    ']': function() {}

  };
  /*********  End Router  *********/


  var handleWord = function(word) {
    if (inChar) {
      if (isUpperCase(word[0])) {
        word = parseCharacter(word);
        word = addHonorifics(word);
      } else {
        word = '<span class="direction">' + word + '</span>'; 
      }
    } else {
      word = decipher(word);
    }

    if (!inTag) syllables += countSyllables(word);

    formatted += word;

    inWord = false;
    wordCount++;
  };

  // Traverse line.
  for (i; i < line.length; i++) {
    letter = line[i];

    // Handle hypens.
    if (letter === '-') {
      if (line[i+1] === ' ') {
        line = line.slice(0, i+1) + line.slice(i+2);
      } else {
        line = line.slice(0, i) + line.slice(i+1);
        letter = line[i];
      }
    }

    // Process words.
    if (!inWord && isLetter(letter)) {
      inWord = true;
      wordStart = i;

    } else if (inWord && !isLetter(letter)) {
      handleWord(line.slice(wordStart, i));
 
    } else if (inWord && i+1 === line.length) {
      handleWord(line.slice(wordStart, i+1));
    }

    // HTML format non-letters.
    if (letter >= 0 && letter <= 9) {
      formatted += letter;
    } else if (!isLetter(letter)) {
      try {
        html[line[i]]();
      } catch (e) {
        throw 'Unknown html route: "' + line[i] + '": ' + line + '\n' + e;
      }
    }
  }

  // Add formatting before the line.
  if (line[0] === '<' && line[line.length-1] === '>' && closeCount === 1) {
    isLine = false;
    isEnd = true;
  } 
  if (isStart && isLine) formatted = '<p>' + formatted;


  // Add formatting after the line.
  if (lineCount % 5 === 0 && isLine) {
    formatted += ' <span class ="line-end line-count">' + lineCount + '</span> ';
  }
  else {
    formatted += ' <span class ="line-end">&nbsp</span> ';
  }
  if (poetry && isLine && syllables !== 0) {
    formatted += ' <span class ="syllable-count">' + syllables + '</span>';
  }
  if (isLine) {
    if (isEnd) {
      formatted += '</p>';
    } else {
      formatted += '<br>';
    }
  }


  return {
    formatted: formatted, 
    isLine: isLine,
    isEnd: isEnd
  };
};

var countSyllables = function(word) {
  word = word.toLowerCase();
  var syllables = 0;
  var inSyllable = false;

  // Traverse the word, and count groupings of vowels.
  for (var i = 0; i < word.length; i++) {
    if (vowels[word[i]]) {
      if (!inSyllable && !isSilentE(word.slice(i-2, i+3))) {
        inSyllable = true;
        syllables++;
      }
    } else {
      inSyllable = false;
    }
  }

  // Edge case.
  if (word[word.length-1] === "'") return syllables;

  return syllables || 1;
};

var isUpperCase = function(string) {
  return string == string.toUpperCase();
};

isSilentE = function(letters) {
  if (letters[2] !== 'e') return false;

  // e.g. uncklE or morE
  if (!letters[3]) {
    if (!vowels[letters[0]] && (letters[1] === 'l' || letters[1] === 'r')) {
      return false;
    }
    return true;
  }

  //  e.g. homEs
  if (letters[3] === 's' && !letters[4]) return true;

  // e.g. wherEfore
  // if (!vowels[letters[1]] && letters[2]) return true;

  return false;
};

var isPoetry = function() {
  var line = {
    last: currentText[currentLine-1],
    curr: currentText[currentLine],
    next: currentText[currentLine+1]
  };

  for (var key in line) {
    if (line[key]) line[key] = line[key][7];
    if (!line[key]) line[key] = 'Z';
  }

  var couldBe = function(poetry) {
    return !isLetter(poetry) || isUpperCase(poetry);
  };

  if (!isLetter(line.curr)) {
    if (couldBe(line.next)) return true;

  } else if (isUpperCase(line.curr)) {
    if (couldBe(line.last) && couldBe(line.next)) return true;
  }

  return false;
};


// Returns true if a character could be part of a word.
var isLetter = function(letter) {
  if (extras[letter]) return true;

  letter = letter.charCodeAt(0);

  if (letter > 64 && letter < 91) return true;    // A - Z
  if (letter > 96 && letter < 123) return true;   // a - z
  if (letter > 191 && letter < 383) return true;  // À - ž
  return false;
};

//Write an ID tag for headings
var getId = function (line) {
  var scenes = {
    'Prima': 1,
    'cunda': 2,
    'ertia': 3,
    'uarta': 4,
    'uinta': 5
  };
  var numeral = {
    1: 'I',
    2: 'II',
    3: 'III',
    4: 'IV',
    5: 'V'
  };

  var start = 'id="' + numeral[actCount];

  for (var i = 0; i < line.length; i++) {
    var match = scenes[line.slice(i, i+5)];
    if (match) {
      return start + match + '"';
    }
  }

  return start + '1"';
};

// Write out full character names.
var parseCharacter = function(name) {
  var confirm = '';
  var target = '';
  var result = '';
  var found = false;

  var searchLine = function(line) {
    // console.log('Searching for', target, 'in line', line.slice(0, 30), '...');
    for (var i = 0; i < line.length; i++) {
      var match = line.slice(i, i + target.length);
      if (match === target) {
        found = true;
        return true; //break for loop
      }
      var tag = line.slice(i, i+3);
      if (tag === '<h2' || tag === '<h3' || tag === '<Z ') {
          return true;
      }
    }
    return false;
  };

  if (names[name]) {

    target = names[name];
    if ((target.match(/ /g) || []).length === 1) {
      target = target.slice(target.indexOf(' ')+1);
    }

    for (var i = formattedText.length-1; i > -1; i--) {
      if (searchLine(formattedText[i])) i = -1;
    }

    if (!found) {
      for (var i = currentLine; i < currentText.length; i++) {
        if (searchLine(currentText[i])) i = currentText.length;
      }
    }
  }

  if (found) return names[name];

  if (names[name]) {
    confirm = readline.question('\nIs ' + name + '. == ' + names[name] +'? ');
    if (confirm.length === 0) return names[name];
  } else {
    confirm = readline.question('\nWho is ' + name + '.? ');
  }

  names[name] = confirm;  
  return confirm;
};

var addHonorifics = function(name) {
  if ((name.match(/ /g) || []).length === 1) {
    name = name.split(' ');
    return '<span class="sub-honorific">' + name[0] + '</span> <span class="sub-name addendum">' + name[1] + '</span>';
  }
  return name;
};

// Returns a word from cipher, or prompts if unknown. Handles caps.
var decipher = function(word) {
  var allCaps = isUpperCase(word);
  var capitalized = isUpperCase(word[0]) && !allCaps;

  if (allCaps) word = word.toLowerCase();
  if (capitalized) word = word[0].toLowerCase() + word.slice(1);

  if (cipher[word]) {
    word = cipher[word];
    changeCount++;
  } else if (check.isMisspelled(word) && 
    switchIsIn(word) && !ignore[word] && !skip[word]) {
    word = prompt(word);
  }

  if (allCaps) word = word.toUpperCase();
  if (capitalized) word = word[0].toUpperCase() + word.slice(1);

  return word;
};

// Check if a commonly switched character is in a word.
var switchIsIn = function(word) {
  word = word.toLowerCase();

  for (var key in switches) {
    if (word.indexOf(switches[key]) > -1) return true;
  }

  return false;
};

// Prompt the user for the spelling of a word.
var prompt = function(word) {
  var changed = readline.question('\nChange ' + word + '? ');

  if (changed.length === 0) {
    ignore[word] = true;
    return word;
  }

  if (changed === '`') {
    skip[word] = true;
    return word;
  }

  if (changed === '*') {
    changed = '';
    for (var i = 0; i < word.length; i++) {
      if (switches[word[i]]) {
        changed += switches[word[i]];
      } else {
        changed += word[i];
      }
    }

  } else if (switches[changed]) {
    // Build RegExp object to replace all shortcut instances.
    var regexp = new RegExp(switches[changed], 'g');
    changed = word.replace(regexp, changed);
  }

  cipher[word] = changed;
  ignore[changed] = true;
  cipherCount++;
  changeCount++;
  return changed;
};


// Console log some information about the process.
var report = function() {
  var skippedWords = '';

  for (var key in skip) {
    skippedWords += key + '    ';
  }

  console.log('\n' + wordCount + ' words analyzed.');
  console.log(changeCount + ' words changed.');
  console.log(cipherCount + ' new swaps in the cipher.\n');

  if (skippedWords.length > 0) console.log('Skipped words: ' + skippedWords + '\n');
}


// Write to disk the updated text, cipher, and ignore list.
var write = function(data) {
  fs.writeFile(path.target, data, 'utf8', function(err) {
    if (err) throw err;
  });
  fs.writeFile(path.cipher, JSON.stringify(cipher, null, 2), 'utf8', function(err) {
    if (err) throw err;
  });
  fs.writeFile(path.ignore, JSON.stringify(ignore, null, 2), 'utf8', function(err) {
    if (err) throw err;
  });
  fs.writeFile(path.names, JSON.stringify(names, null, 2), 'utf8', function(err) {
    if (err) throw err;
  });
};


// If no arguments are provided, use the default textfile.
if (process.argv.length < 3) {
process.argv[2] = path.defTarget;
}

// Process each of the arguments.
for (var i = 2; i < process.argv.length; i++) {
  path.target = process.argv[i];
  var text = fs.readFileSync(path.target, 'utf8');
  write(format(text));
}

report();