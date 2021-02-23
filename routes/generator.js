class CrosswordGenerator {
  //With the words now picked, prepare to make a crossword layout (grid) for them.
  constructor(pickedWordData) {
    this.pickedWords = pickedWordData;

    this.layoutString = ""; //A string of the grid layout. "-" is a blank space.
    this.gridSize = 32;
    this.gridSizeMax = this.gridSize * this.gridSize;
    this.failed = false;
  }

  //This will give us an actual crossword layout
  Generate() {
    this.numberArray = [];

    //Add slots (-)
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        this.layoutString = this.layoutString.concat("-");
        this.numberArray.push(0);
      }
    }

    this.wordsPlaced = 0;

    //Now insert words at a starting
    this.layoutIndex =
      this.gridSize * Math.floor(this.gridSize / 4) +
      Math.floor(this.gridSize / 4);

    this.InsertWordIntoLayout(this.pickedWords[0].word, true);

    //Make sure every word actually got placed...
    if (this.wordsPlaced < this.pickedWords.length) this.failed = true;
    else if (this.pickedWords.length < 7) this.MakeSureTilesAreSpacedOut();

    return this.pickedWords;
  }

  InsertWordIntoLayout(wordToInsert, horizontal) {
    var pickedWordIndex = -1;

    //Find the index of the word to be inserted
    for (let i = 0; i < this.pickedWords.length; i++) {
      if (wordToInsert == this.pickedWords[i].word) {
        pickedWordIndex = i;
        break;
      }
    }
    if (pickedWordIndex == -1) {
      //console.log("No word found?");
      return;
    }

    let wordToPlace = this.pickedWords[pickedWordIndex].word;

    //Replaces - with each letter ( <----------------------------------------   Insert words here!)
    for (let i = 0; i < wordToPlace.length; i++) {
      if (this.CheckIfLetterConflicts(i, wordToPlace)) return;

      //Replace word
      this.layoutString = this.ReplaceCharAt(
        this.layoutString,
        this.layoutIndex,
        wordToPlace[i]
      );

      //Assign the number at the start of the word
      this.AssignNumber(i, pickedWordIndex);

      //Go either 1 slot to the right or 1 slot down
      if (!horizontal) this.layoutIndex += this.gridSize;
      else this.layoutIndex++;
    }

    this.wordsPlaced++;

    //Now look at the linked characters, and attach their words too.
    let childWords = this.pickedWords[pickedWordIndex].childWords;
    /*console.log(this.pickedWords[pickedWordIndex].word + " has these child words:");
        //console.log(this.pickedWords[pickedWordIndex].childWords);
        //console.log("\n");*/

    if (!childWords) return;

    let layoutIndexAtEndOfWord = this.layoutIndex; //(horizontal ? this.layoutIndex-1 : this.layoutIndex-this.gridSize);
    for (let i = 0; i < childWords.length; i++) {
      //Find what letter the child word will be added at.
      let targetIndex = this.pickedWords[pickedWordIndex].charIndexesBeingUsed[
        i
      ];
      this.layoutIndex =
        layoutIndexAtEndOfWord -
        (horizontal ? wordToPlace.length : wordToPlace.length * this.gridSize) +
        (horizontal ? targetIndex : targetIndex * this.gridSize);

      //Find how far up/left the world will start.
      let identicalChar = this.pickedWords[pickedWordIndex].charsBeingUsed[i];
      let wordStartingIndex = childWords[i].indexOf(identicalChar);

      //console.log(wordToPlace + " " + childWords[i] + " " + identicalChar);

      this.layoutIndex -= !horizontal
        ? wordStartingIndex
        : wordStartingIndex * this.gridSize;

      //this.layoutIndex = this.pickedWords[pickedWordIndex].childWords;
      this.InsertWordIntoLayout(childWords[i], !horizontal);
    }
  }

  //Every word needs a number on the crossword puzzle
  AssignNumber(i, pickedWordIndex) {
    if (i == 0) {
      //If empty, then replace 0 with the actual number.
      if (this.numberArray[this.layoutIndex] == 0)
        this.numberArray[this.layoutIndex] = this.pickedWords[
          pickedWordIndex
        ].number;
      //If not empty, you have to share a slot with another word...
      else {
        let str = this.numberArray[this.layoutIndex].toString();
        let newStr = str.concat(
          this.pickedWords[pickedWordIndex].number.toString()
        );
        this.numberArray[this.layoutIndex] = parseInt(newStr);
      }
    }
  }

  //Replace a character at the given index. Javascript can't do this easily like other languages :P
  ReplaceCharAt(string, index, replacement) {
    return (
      string.substr(0, index) +
      replacement +
      string.substr(index + replacement.length)
    );
  }

  //----------------------------------------------------------------------------------------------------------------------
  //Functions that prevent impossible/ugly layouts below
  //----------------------------------------------------------------------------------------------------------------------

  //If the crossword overlaps old words or becomes unreadable, this function returns true.
  CheckIfLetterConflicts(i, wordToPlace) {
    //Make sure word is blank (-) or at least matching the letter being inserted
    if (
      this.layoutString[this.layoutIndex] != wordToPlace[i] &&
      this.layoutString[this.layoutIndex] != "-"
    ) {
      //console.log("Whoops! Non matching letters collided with each other! Restarting...");
      this.failed = true;
      return true;
    }
    //Make sure at the start of the word, 1 letter to the left or above isn't filled in yet. Otherwise we'd have a wrong word
    else if (
      i == 0 &&
      ((this.layoutIndex - 1 > 0 &&
        this.layoutString[this.layoutIndex - 1] != "-") ||
        (this.layoutIndex - this.gridSize >= 0 &&
          this.layoutString[this.layoutIndex - this.gridSize] != "-"))
    ) {
      //this.LogSurroundingLetters();
      //console.log("Whoops! Two letters are next to each other and they don't make a word. (Left or top) Restarting...");
      this.failed = true;
      return true;
    }
    //Make sure at the end of the word, 1 letter to the right or below isn't filled in yet. Otherwise we'd have a wrong word
    else if (
      i == wordToPlace.length - 1 &&
      ((this.layoutIndex + 1 < this.layoutString.length &&
        this.layoutString[this.layoutIndex + 1] != "-") ||
        (this.layoutIndex + this.gridSize < this.gridSizeMax - this.gridSize &&
          this.layoutString[this.layoutIndex + this.gridSize] != "-"))
    ) {
      //this.LogSurroundingLetters();
      //console.log("Whoops! Two letters are next to each other and they don't make a word (Right or bottom). Restarting...");
      this.failed = true;
      return true;
    }

    return false;
  }

  LogSurroundingLetters() {
    //console.log("-"+ this.layoutString[this.layoutIndex-this.gridSize] + "-");
    //console.log(this.layoutString[this.layoutIndex-1] + this.layoutString[this.layoutIndex]  + this.layoutString[this.layoutIndex+1]);
    //console.log("-" + this.layoutString[this.layoutIndex+this.gridSize] + "-");
  }

  //Make sure crossword is neat and spaced out. We don't want more than 4 letters to be surrounding a letter
  MakeSureTilesAreSpacedOut() {
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        let index = j + i * this.gridSize;

        //Ignore blank spots
        if (this.layoutString[index] == "-") continue;

        //Get all surrounding tiles (It's like minesweeper)
        let topChar = this.layoutString[index - this.gridSize];
        let bottomChar = this.layoutString[index + this.gridSize];
        let rightChar = this.layoutString[index + 1];
        let leftChar = this.layoutString[index - 1];
        let topRightChar = this.layoutString[index - this.gridSize + 1];
        let bottomRightChar = this.layoutString[index + this.gridSize + 1];
        let topLeftChar = this.layoutString[index - this.gridSize - 1];
        let bottomLeftChar = this.layoutString[index + this.gridSize - 1];

        let surroundingLetterCount =
          (topChar != "-") +
          (bottomChar != "-") +
          (rightChar != "-") +
          (leftChar != "-") +
          (topRightChar != "-") +
          (bottomRightChar != "-") +
          (topLeftChar != "-") +
          (bottomLeftChar != "-");

        if (surroundingLetterCount >= 5) {
          this.failed = true;
          //console.log(surroundingLetterCount + " surrounding words...");
          break;
        }
      }
    }
  }
}

module.exports = CrosswordGenerator;
