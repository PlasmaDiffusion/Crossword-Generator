class CrosswordGenerator {

    //This constructor will pick the words to use and link them
    constructor(pickedWordData)
    {
        this.pickedWords = pickedWordData;

        this.layoutString = ""; //A string of the grid layout. "-" is a blank space.
        this.gridSize = 32;
        this.gridSizeMax = this.gridSize*this.gridSize;
        this.failed = false;
    }

    //This will give us an actual crossword layout
    Generate()
    {


        //Add slots (-)
        for (let i = 0; i < this.gridSize; i++)
        {

            for (let j = 0; j < this.gridSize; j++)
            {
                this.layoutString = this.layoutString.concat("-");
            }

        }
        this.callNumber = 0;

        for (let i =0; i < this.pickedWords.length; i++)
        {
            //console.log(this.pickedWords[i].childWords);
        }

        //Now insert words
        this.layoutIndex = (this.gridSize * 8) + 8;
        
        this.InsertWordIntoLayout(this.pickedWords[0].word, true);
        

        
        console.log("Layout: \n");

        var debugString = "";

        for (let i = 0; i < this.layoutString.length; i++)
        {
            
            if ((i % this.gridSize) == 0 && i != 0) debugString = debugString.concat("\n");
            debugString = debugString.concat(this.layoutString[i]);

        }
        console.log(debugString);

        return this.pickedWords;
    }
    
    InsertWordIntoLayout(wordToInsert, horizontal) 
    {

       //Bug: If first word has no child words then nothing gets added
    

        var pickedWordIndex = -1;

        //Find the index of the word to be inserted
        for (let i = 0; i < this.pickedWords.length; i++)
        {
            if (wordToInsert == this.pickedWords[i].word)
            {
                pickedWordIndex = i;
                break;
            }
        }
        if (pickedWordIndex == -1)
        {
            console.log("No word found?");
            return;
        }

        let wordToPlace = this.pickedWords[pickedWordIndex].word;

        //Replaces - with each letter
        for (let i = 0; i < wordToPlace.length; i++)
        {
            if (this.CheckIfLetterConflicts(i, wordToPlace)) return;

            //Replace word
            this.layoutString = this.ReplaceCharAt(this.layoutString, this.layoutIndex, wordToPlace[i]);
            
            //Go either 1 slot to the right or 1 slot down
            if (!horizontal) this.layoutIndex+= this.gridSize;
            else this.layoutIndex++;
        }


        //Now look at the linked characters, and attach their words too.
        let childWords = this.pickedWords[pickedWordIndex].childWords;
        console.log(this.pickedWords[pickedWordIndex].word + " has these child words:");
        console.log(this.pickedWords[pickedWordIndex].childWords);
        console.log("\n");


        if(!childWords) return;

        let layoutIndexAtEndOfWord = this.layoutIndex; //(horizontal ? this.layoutIndex-1 : this.layoutIndex-this.gridSize);
        for (let i = 0; i < childWords.length; i++)
        {


            //Find what letter the child word will be added at.
            let  targetIndex = this.pickedWords[pickedWordIndex].charIndexesBeingUsed[i];
            this.layoutIndex = (layoutIndexAtEndOfWord - (horizontal ? wordToPlace.length : wordToPlace.length * this.gridSize))
            + (horizontal ? targetIndex : targetIndex * this.gridSize);


            //Find how far up/left the world will start.
            let identicalChar = this.pickedWords[pickedWordIndex].charsBeingUsed[i];
            let wordStartingIndex = childWords[i].indexOf(identicalChar);
            
            //console.log(wordToPlace + " " + childWords[i] + " " + identicalChar);

            this.layoutIndex -= (!horizontal ? wordStartingIndex : wordStartingIndex * this.gridSize)


            //this.layoutIndex = this.pickedWords[pickedWordIndex].childWords;
            this.InsertWordIntoLayout(childWords[i], !horizontal);
            
        }

    }

    //Replace a character at the given index. Javascript can't do this easily like other languages :P
    ReplaceCharAt(string, index, replacement)
    {
        return string.substr(0, index) + replacement + string.substr(index + replacement.length);
    }
    
    //If the crossword overlaps old words or becomes unreadable, this function returns true.
    CheckIfLetterConflicts(i, wordToPlace)
    {
        //Make sure word is blank (-) or at least matching the letter being inserted
        if (this.layoutString[this.layoutIndex] != wordToPlace[i] && this.layoutString[this.layoutIndex] != '-')
        {
            console.log("Whoops! Non matching letters collided with each other! Restarting...");
            this.failed = true;
            return true;
        }
        //Make sure at the start of the word, 1 letter to the left or above isn't filled in yet. Otherwise we'd have a wrong word
        else if(i == 0 && ((this.layoutIndex-1 > 0 && this.layoutString[this.layoutIndex-1] != '-')
            || (this.layoutIndex-this.gridSize >= 0 && this.layoutString[this.layoutIndex-this.gridSize] != '-')))
        {
            this.LogSurroundingLetters();
            console.log("Whoops! Two letters are next to each other and they don't make a word. (Left or top) Restarting...");
            this.failed = true;
            return true;
        }
        //Make sure at the start of the word, 1 letter to the right or below isn't filled in yet. Otherwise we'd have a wrong word
        else if(i == wordToPlace.length-1 && ((this.layoutIndex+1 < this.layoutString.length && this.layoutString[this.layoutIndex+1] != '-')
            || (this.layoutIndex+this.gridSize < this.gridSizeMax-this.gridSize && this.layoutString[this.layoutIndex+this.gridSize] != '-')))
        {
            this.LogSurroundingLetters();
            console.log("Whoops! Two letters are next to each other and they don't make a word (Right or bottom). Restarting...");
            this.failed = true;
            return true;
        }

        return false;
    }

    LogSurroundingLetters()
    {
        console.log("-"+ this.layoutString[this.layoutIndex-this.gridSize] + "-");
        console.log(this.layoutString[this.layoutIndex-1] + this.layoutString[this.layoutIndex]  + this.layoutString[this.layoutIndex+1]);
        console.log("-" + this.layoutString[this.layoutIndex+this.gridSize] + "-");
    }
    
  }
  
module.exports = CrosswordGenerator