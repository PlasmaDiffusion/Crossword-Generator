class CrosswordGenerator {

    //When constructing the class generate this
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
                        if (this.pickedWords[j][0].linkedChars)
                        {
                            unableToUse = this.pickedWords[j][0].linkedChars.includes(charBeingLinkedTo);
                            
                            //If you can't use this character, try the other ones
                            if(unableToUse)
                            {
                            possibleCharactersToGroupTo.splice(randomChar, 1);
                            }
                        }
                        else //If there's no linkedCharacters, we can use any of them. Make sure the variable gets initialized though.
                        {
                            this.pickedWords[j][0].linkedChars = "";
                        }


                    }while(unableToUse);

                    //Link the word to the given letter at the linkedIndex
                    this.pickedWords[i][0].linkedWord = this.pickedWords[j][0].word;
                    this.pickedWords[i][0].linkedCharIndex = linkedIndex;
                    this.pickedWords[j][0].linkedChars = this.pickedWords[j][0].linkedChars.concat(charBeingLinkedTo);

                    
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

    //Call this when generated
    GetGeneratedData()
    {
        //console.log("Using these words: \n");
        console.log(this.pickedWords);
        //console.log("Generated: \n");
        //console.log(this.crossWordData);
        return this.pickedWords;
    }
    
    
  }
  
module.exports = CrosswordGenerator