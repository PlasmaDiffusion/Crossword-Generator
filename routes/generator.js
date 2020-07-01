class CrosswordGenerator {

    //This constructor will pick the words to use and link them
    constructor(pickedWordData)
    {
        this.pickedWords = pickedWordData;

        this.layoutString = ""; //A string of the grid layout. "-" is a blank space.
        this.gridSize = 32;
        this.pickedWords[0][0].horizontal = true; //A flag that swaps each time a word is added.
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
            console.log(this.pickedWords[i][0].childWords);
        }

        //Now insert words
        this.layoutIndex = (this.gridSize * 8) + 8;
        
        this.InsertWordIntoLayout(this.pickedWords[0][0].word, true);
        

        
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
            if (wordToInsert == this.pickedWords[i][0].word)
            {
                pickedWordIndex = i;
                break;
            }
        }

        //this.pickedWords[pickedWordIndex][0].horizontal = horizontal;
        
        let wordToPlace = this.pickedWords[pickedWordIndex][0].word;

        //Replaces - with each letter
        for (let i = 0; i < wordToPlace.length; i++)
        {
            //Make sure word is blank (-) or at least matching the letter being inserted
            if (this.layoutString[this.layoutIndex] != wordToPlace[i] && this.layoutString[this.layoutIndex] != '-')
            {
                console.log("Whoops! Non matching letters collided with each other! Restarting...");
                this.failed = true;
                return;
            }

            //Replace word
            this.layoutString = this.ReplaceCharAt(this.layoutString, this.layoutIndex, wordToPlace[i]);
            
            //Go either 1 slot to the right or 1 slot down
            if (!horizontal) this.layoutIndex+= this.gridSize;
            else this.layoutIndex++;
        }


        //Now look at the linked characters, and attach their words too.
        let childWords = this.pickedWords[pickedWordIndex][0].childWords;


        if(!childWords) return;

        let layoutIndexAtEndOfWord = this.layoutIndex; //(horizontal ? this.layoutIndex-1 : this.layoutIndex-this.gridSize);
        for (let i = 0; i < childWords.length; i++)
        {


            //Find what letter the child word will be added at.
            let  targetIndex = this.pickedWords[pickedWordIndex][0].charIndexesBeingUsed[i];
            this.layoutIndex = (layoutIndexAtEndOfWord - (horizontal ? wordToPlace.length : wordToPlace.length * this.gridSize))
            + (horizontal ? targetIndex : targetIndex * this.gridSize);


            //Find how far up/left the world will start.
            let identicalChar = this.pickedWords[pickedWordIndex][0].charsBeingUsed[i];
            let wordStartingIndex = childWords[i].indexOf(identicalChar);
            
            //console.log(wordToPlace + " " + childWords[i] + " " + identicalChar);

            this.layoutIndex -= (!horizontal ? wordStartingIndex : wordStartingIndex * this.gridSize)


            //this.layoutIndex = this.pickedWords[pickedWordIndex][0].childWords;
            this.InsertWordIntoLayout(childWords[i], !horizontal);
            
        }

    }

    ReplaceCharAt(string, index, replacement)
    {
        return string.substr(0, index) + replacement + string.substr(index + replacement.length);
    }
    
    
  }
  
module.exports = CrosswordGenerator