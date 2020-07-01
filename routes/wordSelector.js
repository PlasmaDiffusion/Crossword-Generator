class WordSelector {

    //This constructor will pick the words to use and link them
    constructor(wordData, numberOfWords)
    {

        //console.log(wordData);
        this.failed = false;


        //Try to pick some words, and then try to link them together
        do
        {
            
        this.wordData = [...wordData]; //Get a copy of the array of all words
        
        console.log("Attempting to generate");
        
        this.pickedWords = [];
        this.PickWords(numberOfWords);
        //console.log(this.wordData.length);
        }while(!this.GroupWordsTogether());

    }

    //Pick x number of words
    PickWords(numberOfWords)
    {
        //Take words from this pool
        var wordsAvailable = this.wordData;
        console.log(wordsAvailable);

        if (wordsAvailable.length < 4) console.log("EH? less than 4 words available.")
        console.log(wordsAvailable.length);

        for(let i = 0; i<numberOfWords; i++)
        {
            var indexToPick = Math.floor(Math.random() * wordsAvailable.length);
            //Add a word to the pickedWords array. Remove this word from the wordsAvailable array.
            this.pickedWords.push(wordsAvailable[indexToPick]);
            wordsAvailable.splice(indexToPick, 1);

        }


        //console.log("Picked the following words: ")
        //console.log(this.pickedWords);
    }

    //Make every word can be part of another word.
    GroupWordsTogether()
    {
        if (this.pickedWords.length < 4)
        {
            console.log("No words???");
            return false;
        }

        //Declare/reset grouped word data
        for (let i = 0; i<this.pickedWords.length; i++)
        {
        this.pickedWords[i].charsBeingUsed = "";
        this.pickedWords[i].childWords = [];
        this.pickedWords[i].charIndexesBeingUsed = [];
        this.pickedWords[i].linkedWord = null;
        this.pickedWords[i].linkedCharIndex = null;
        }


        //See if a word matches
        for (let i = 1; i<this.pickedWords.length; i++)
        {
            let word = this.pickedWords[i].word;
            console.log(word);


            let attempts = 0;

            //See if any of the other words match with the former word
            for (let j = 0; j<this.pickedWords.length; j++)
            {
                //Ignore self
                if (i == j) continue;

                let possibleCharactersToGroupTo = this.CheckIfWordContainsMatchingCharacter(word, this.pickedWords[j].word);
                if (possibleCharactersToGroupTo.length > 0)
                {
                    let loops = 0;
                    //Pick a random character to link the word together. BUT you can't pick a character that was already used.
                    do
                    {
                        let randomChar = Math.floor(Math.random() * possibleCharactersToGroupTo.length);
                        var linkedIndex = possibleCharactersToGroupTo[randomChar];
                        var charBeingLinkedTo = this.pickedWords[j].word.charAt(linkedIndex);
                        var unableToUse = false;

                        
                        //Check if character is already in use
                        if (this.pickedWords[j].charsBeingUsed != "")
                        {
                            unableToUse = this.pickedWords[j].charsBeingUsed.includes(charBeingLinkedTo);
                            
                            //If you can't use this character, try the other ones
                            if(unableToUse)
                            {
                            possibleCharactersToGroupTo.splice(randomChar, 1);
                            }
                        }
                        //If there's no linkedCharacters, we can use any of them. Make sure the variable gets initialized though.
                        

                        if(++loops > 500) unableToUse = false;
                    }while(unableToUse);

                    //Link the word to the given letter at the linkedIndex
                    this.pickedWords[i].linkedWord = this.pickedWords[j].word;
                    this.pickedWords[i].linkedCharIndex = linkedIndex;
                    
                    //Word that is getting a child word added to it. Give it info on where this will be.
                    this.pickedWords[j].charsBeingUsed = this.pickedWords[j].charsBeingUsed.concat(charBeingLinkedTo);
                    this.pickedWords[j].childWords.push(this.pickedWords[i].word);
                    this.pickedWords[j].charIndexesBeingUsed.push(linkedIndex);

                    
                    //console.log(word + " will be linked to " + this.pickedWords[i].linkedWord + " (" + this.pickedWords[j].word.charAt(linkedIndex) + ")");

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

        //If the code made it here, it succeeded BUT the first word must be linked to another word
        return this.pickedWords[0].childWords.length > 0;
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
    
  }
  
module.exports = WordSelector