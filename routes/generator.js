class CrosswordGenerator {

    //This constructor will pick the words to use and link them
    constructor(wordData, numberOfWords)
    {

        console.log(wordData);

        do
        {
        this.wordData = wordData;
        console.log("Attempting to generate");
        this.pickedWords = [];
        this.PickWords(numberOfWords);
        console.log(this.wordData.length);
        }while(!this.GroupWordsTogether());

        //this.pickedWords = [];
        //this.PickWords(numberOfWords);
        //this.GroupWordsTogether();
    }

    //Pick x number of words
    PickWords(numberOfWords)
    {
        //Take words from this pool
        var wordsAvailable = this.wordData;
        console.log(wordsAvailable);

        for(let i = 0; i<numberOfWords; i++)
        {
            var indexToPick = Math.floor(Math.random() * wordsAvailable.length);
            //Add a word to the pickedWords array. Remove this word from the wordsAvailable array.
            this.pickedWords.push(
                wordsAvailable.splice(indexToPick, 1));
 
            console.log(this.pickedWords[i]);

        }


        //console.log("Picked the following words: ")
        //console.log(this.pickedWords);
    }

    //Make every word can be part of another word.
    GroupWordsTogether()
    {
        var characterIndexesInUse = [];
        //See if a word matches
        for (let i = 0; i<this.pickedWords.length; i++)
        {
            characterIndexesInUse.push([i,0]);
        }

        //See if a word matches
        for (let i = 1; i<this.pickedWords.length; i++)
        {
            let word = this.pickedWords[i][0].word;
            //console.log(word);
            let attempts = 0;

            //See if any of the other words match with the former word
            for (let j = 0; j<this.pickedWords.length; j++)
            {
                //Ignore self
                if (i == j) continue;

                let possibleCharactersToGroupTo = this.CheckIfWordContainsMatchingCharacter(word, this.pickedWords[j][0].word);
                if (possibleCharactersToGroupTo.length > 0)
                {
                    //Pick a random character to link the word together. BUT you can't pick a character that was already used.
                    do
                    {
                        let randomChar = Math.floor(Math.random() * possibleCharactersToGroupTo.length);
                        var linkedIndex = possibleCharactersToGroupTo[randomChar];
                        var charBeingLinkedTo = this.pickedWords[j][0].word.charAt(linkedIndex);
                        var unableToUse = false;

                        
                        //Check if character is already in use
                        if (this.pickedWords[j][0].charsBeingUsed)
                        {
                            unableToUse = this.pickedWords[j][0].charsBeingUsed.includes(charBeingLinkedTo);
                            
                            //If you can't use this character, try the other ones
                            if(unableToUse)
                            {
                            possibleCharactersToGroupTo.splice(randomChar, 1);
                            }
                        }
                        else //If there's no linkedCharacters, we can use any of them. Make sure the variable gets initialized though.
                        {
                            this.pickedWords[j][0].charsBeingUsed = "";
                            this.pickedWords[j][0].childWords = [];
                            this.pickedWords[j][0].charIndexesBeingUsed = [];
                        }


                    }while(unableToUse);

                    //Link the word to the given letter at the linkedIndex
                    this.pickedWords[i][0].linkedWord = this.pickedWords[j][0].word;
                    this.pickedWords[i][0].linkedCharIndex = linkedIndex;
                    
                    //Word that is getting a child word added to it. Give it info on where this will be.
                    this.pickedWords[j][0].charsBeingUsed = this.pickedWords[j][0].charsBeingUsed.concat(charBeingLinkedTo);
                    this.pickedWords[j][0].childWords.push(this.pickedWords[i][0].word);
                    this.pickedWords[j][0].charIndexesBeingUsed.push(linkedIndex);

                    
                    console.log(word + " will be linked to " + this.pickedWords[i][0].linkedWord + " (" + this.pickedWords[j][0].word.charAt(linkedIndex) + ")");

                    break;
                }
                else
                {
                    //No matches at all? Try the other words, but if there's no possible match then start over completely.
                    attempts++;
                    if (attempts >= this.pickedWords.length-1)
                        return false;
                }
               
            }
        }

        return true;
    }

    CheckIfWordContainsMatchingCharacter(word1, word2)
    {
        //Put characters that could be used here.
        var indexesToUse = [];
        var charactersToUse = [];

            for (let j = 0; j<word2.length; j++)
            {
                if (word1.includes(word2.charAt(j)))
                    {
                    indexesToUse.push(j);
                    charactersToUse.push(word2.charAt(j));
                    }
            }   

        
        //console.log("\n");
        //console.log("The following letters match between " + word1 + " and " + word2);
        //console.log(charactersToUse);
        //console.log("\n");

        

        return indexesToUse;
        

    }

    //This will give us an actual crossword layout
    Generate()
    {
        this.layoutString = ""; //A string of the grid layout. "-" is a blank space.
        this.gridSize = 32;
        this.pickedWords[pickedWordIndex][0].horizontal = true; //A flag that swaps each time a word is added.

        //Add slots (-)
        for (let i = 0; i < gridSize; i++)
        {

            for (let j = 0; j < gridSize; j++)
            {
                this.layoutString = this.layoutString.concat("-");
            }

            this.layoutString = this.layoutString.concat("\n");
        }


        //Now insert words
        this.layoutIndex = (gridSize * 8) + 8;
        for (let i = 0; i<this.pickedWords.length; i++)
        {
            this.InsertWordIntoLayout(i);
        }

        console.log(this.layoutString);
        //console.log("Using these words: \n");
        console.log(this.pickedWords);
        //console.log("Generated: \n");
        //console.log(this.crossWordData);
        return this.pickedWords;
    }
    
    InsertWordIntoLayout(wordToInsert, horizontal) 
    {
        var pickedWordIndex = 0;

        //Find the index of the word to be inserted
        for (let i = 0; i < this.pickedWords.length; i++)
        {
            if (wordToInsert == this.pickedWords[i][0].word)
            pickedWordIndex = i;
            break;
        }

        this.pickedWords[pickedWordIndex][0].horizontal = horizontal;
        
        let wordToPlace = this.pickedWords[pickedWordIndex][0].word;

        //Replaces - with each letter
        for (let i = 0; i < wordToPlace.length; i++)
        {
            this.layoutString = this.ReplaceCharAt(this.layoutString, this.layoutIndex, wordToPlace[i]);
            this.layoutIndex++;
        }


        //Now look at the linked characters, and attach their words too.
        let childWords = this.pickedWords[pickedWordIndex][0].childWords;
        let layoutIndexPreChildWords = this.layoutIndex;
        for (let i = 0; i < childWords.length; i++)
        {
            //Find what letter the child word will be added at.
            let  targetIndex = this.pickedWords[pickedWordIndex][0].charIndexesBeingUsed[i];
            this.layoutIndex = (layoutIndexPreChildWords - wordToPlace.length) + targetIndex;

            
            //If the current word is vertical, all the child words will be horizontal
            let horizontal = !this.pickedWords[pickedWordIndex][0].horizontal;

            if (!this.horizontalWord) this.layoutIndex+= this.gridSize;

            //Find how far up/left the world will start.
            let identicalChar = this.pickedWords[pickedWordIndex][0].charsBeingUsed[i];
            let wordStartingIndex = childWords[i].indexOf(identicalChar);

            //this.layoutIndex = this.pickedWords[pickedWordIndex][0].childWords;
            this.layoutString = InsertWordIntoLayout(childWords[i], horizontal);
            
        }

        return this.layoutString;
    }

    ReplaceCharAt(string, index, replacement)
    {
        return string.substr(0, index) + replacement + string.substr(index + replacement.length);
    }
    
    
  }
  
module.exports = CrosswordGenerator