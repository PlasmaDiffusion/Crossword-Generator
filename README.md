# Crossword-Generator
NodeJS/Express and MongoDB is used to generate a crossword layout, that the user can then interact with at the front-end. Hogan is used at the front end for displaying the crossword.

index.js has the routes to connect to the database for either getting words or adding words. It uses the word selector and crossword generator classes as well.

wordSelector.js contains the algorithm that picks words to be used, and links words with the same letter. If words cannot link up, the algorithm restarts.

generator.js keeps trying to make a good enough grid layout using the previously selected words.
