#Open Folio

An online edition of Shakespeare's First Folio, formatted in semantic HTML, allowing it to be reformatted with the press of a button. Currently in a public alpha, Open Folio is still under development, but is largley bug free and ready to be used. If you are an actor, director, or scholar, looking for a smartly styled edition of the First Folio, head to [the site](http://delventhalz.github.io/open-folio) and enjoy! A [feedback form](https://docs.google.com/forms/d/1Gfo8GoYPaWUovn_rmnww3ryeyuD2q2f_ulJoRMcNhJM/viewform) can be found on the page, and any suggestions are greatly appreciated. If you are an engineer with an interest in the code behind this repo, read on.

##License

The Open Folio is distributed under the [MIT License](https://github.com/delventhalz/open-folio/blob/master/LICENSE) and is free to use with attribution. The original plays come from [The Oxford Text Archive's](http://ota.ox.ac.uk) machine readable transcription. 

## Repo Contents

This project is designed to be deployable on any web server without a dedicated back-end, and so the majority of the files in this repo are HTML, CSS, and client-side JavaScript. The exceptions are the files in `replacer/`, which contains the command-line tool used to convert the OTA's files into HTML. These (along with `package.json` and `server.js`) are unnecessary to host this project on a conventional static server.

## Contributing

As of now, this is a solo passion project, and there is no contributing guide. If you would like to fork this repo and submit a PR, I might consider it, but probably the best thing to do is to submit a GitHub issue or feedback via [the Google Form](https://docs.google.com/forms/d/1Gfo8GoYPaWUovn_rmnww3ryeyuD2q2f_ulJoRMcNhJM/viewform).