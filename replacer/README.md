# Replacer.js
A basic Node.js tool designed for persistent finding and replacing based on misspellings and flagged characters/strings. Originally designed to handle u's and v's, and j's and i's being randomly swapped by typographers in Shakespeare's First Folio, Replcer.js will search through one or more text files and present the user with misspelled words that contain optional user specified targets such as 'u' an 'v'. **(NOTE: 0.1 is currently hard-coded to use u, v, j, and i, customizable flags are coming soon)**. The user can then specify a new spelling to swap in, which will automatically be applied in the future. Replacer.js will never ask you about the same word twice.

### Installing
Replacer.js requires Node.js and npm in order to run, so make sure you [install those first](https://docs.npmjs.com/getting-started/installing-node). Then download the zip, and install the dependent libraries, [readline-sync](https://github.com/anseki/readline-sync) and [spellchecker](https://github.com/atom/node-spellchecker), by going to the this project's root directory in the command line and typing: 
```
npm install
```
Once the most recent versions of readline-sync and spellchecker are installed by npm, Replacer.js will be ready to use.

### License and Copyright
Standard [MIT License](https://github.com/delventhalz/replacer.js/blob/master/LICENSE.md) applies. If Replacer.js is useful to you, do what you like with it, but credit me and it's not my fault if it breaks.

### Using Replacer.js
From within the directory where you downloaded this repo, type the command: 
```
node replacer
```
This will run the replacer with the default target text file, `target.txt`, and the `ignore.json` and `cipher.json` files located in the `words` directory.

You may specify different target files in the command line as arguments to the replacer command. For example:
```
node replacer macbeth.txt /tempest/act1.md
```
This will run the replacer on `macbeth.txt` and `/tempest/act1.md`.

You may also specify a different directory for `cipher.json` and `ignore.json` by using the `@` character. For example:
```
node replacer @ff
```
This will use `ignore.json` and `cipher.json` files stored in the `/ff` directory, creating them from scratch if necessary. **(NOTE: 0.1 does not currently support this @ argument, and will always default to the 'words' directory)**

You can mix and match these arguments however you like: 
```
node replacer hamlet.md @ff /midsummer/act5.txt
```

### Default Commands
While running, Replacer.js will prompt the user with targeted words which it doesn't recognize. There are a few possible responses.

* If the user types in a replacement for the word, Replacer will make the switch, and remember it next time the word comes up.
* Alternatively, if the user simply presses enter without inputting any text, the word will be unchanged, and added to the ignore list.
* If the user inputs a backtick `` ` ``, the word will be skipped, but not added to the ignore list (useful for words that the user is unsure of).
* If the user inputs an asterisk ` * `, and custom shortcuts have been set (see below), then every possible replacement specified by those shortcuts will be executed.

### Custom Shortcuts
**(NOTE: In 0.1, custom shortcut functionality is hard-wired for u, v, i, j)**
Customs shortcuts are the key getting the most out of Replacer.js, greatly speeding up text processing. They serve a dual purpose. Shortcut keys form a watchlist, narrowing Replacer's prompts to misspelled words that contain items on the watchlist. Additionally, when prompted, the user is able to type in just the desired value for the shortcut to switch all instances to that value.

For example, with custom shortcuts of:

```
{
  "v": "u",
  "u": "v"
}
```

And text of: 
```
I'ue vpturned vs!
```

With these prompts and responses:
```
I'ue? v
vpturned? u
```

The text will change to:
```
I've upturned vs!
```

Notice that to use a shortcut you type in the letter you wish targeted letters to *become*. Notice also, that in the case of `vpturned`, using the shortcut `u` affected only the v's in the word, *not* the u's. Finally, `vs` is in the american english dictionary, and so never generayes a prompt. In order to change `vs` to `us`, manually add `"vs": "us"` to `cipher.json`, and it will be swapped regardless of spelling.

In order to customize your shortcuts, simply modify the `shortcuts.json` file in same folder as the cipher and ignore files you are using. For example, adding a key value combo of `"i": "j"` will watch for misspelled words with an 'i', and allow the user to type `j` to replace replace all i's in a word with a 'j'.


### Using Replacer.js with Shakespeare's First Folio
The default cipher and ignore files included in this repo are designed specifically to make Shakespeare's First Folio more readable by switching u's, v's, j's, and i's appropriately. If that is your purpose in downloading Replacer.js, then it is rather simple to use. After installing:

1. Copy your chosen First Folio text to the clipboard. I prefer the formatting on the [University of Chicago's site](http://www.lib.uchicago.edu/efts/OTA-SHK/restricted/search.form.html).
2. Paste the text into `target.txt` or another text file you plan on using.
3. Run Replacer.js on your files (see above).
4. Respond to any user prompts.
5. That's it! Your text file(s) have been modified.

### Bugs and Typos
If you notice any bugs in the code, or typos in the included First Folio cipher and ignore files, please send as detailed a bug report (including the text being changed) to [delventhalz@gmail.com](mailto:delventhalz@gmail.com?subject=Replacer%20Bug%20Report).