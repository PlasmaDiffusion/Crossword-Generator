class CrosswordGenerator {

    //When constructing the class generate this
    constructor(wordData, numberOfWords)
    {
        this.wordData = wordData;

        /*do
        {
        this.pickedWords = [];
        this.PickWords(numberOfWords);
        }while(this.GroupWordsTogether())*/

        this.pickedWords = [];
        this.PickWords(numberOfWords);
        this.GroupWordsTogether();
    }

    //Pick x number of words
    PickWords(numberOfWords)
    {
        //Take words from this pool
        var wordsAvailable = this.wordData;

        for(let i = 0; i<numberOfWords; i++)
        {
            //Add a word to the pickedWords array. Remove this word from the wordsAvailable array.
            this.pickedWords.push(
                wordsAvailable.splice(Math.floor(Math.random() * wordsAvailable.length),
                1));
        }

        console.log("Picked the following words: ")
        console.log(this.pickedWords);
    }

    //Make every word can be part of another word.
    GroupWordsTogether()
    {
        //See if a word matches
        //for (let i = 0; i<this.pickedWords.length; i++)
        //{
        //    characterIndexesInUse.push([i,0]);
        //}

        //See if a word matches
        for (let i = 0; i<this.pickedWords.length; i++)
        {
            let word = this.pickedWords[i][0].word;
            console.log(word);
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
                    let index = possibleCharactersToGroupTo[Math.floor(Math.random() * possibleCharactersToGroupTo.length)];
                    
                    this.pickedWords[i][0].linkedWord = this.pickedWords[j][0].word;
                    this.pickedWords[i][0].linkedCharIndex = index;
                    
                    console.log(word + " will be linked to " + this.pickedWords[i][0].linkedWord + " (" + this.pickedWords[j][0].word.charAt(index) + ")");

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

        
        console.log("\n");
        console.log("The following letters match between " + word1 + " and " + word2);
        console.log(charactersToUse);
        console.log("\n");

        return indexesToUse;
        

    }

    //Call this when generated
    GetGeneratedData()
    {
        console.log("Generated: \n");
        console.log(this.crossWordData);
        return this.crossWordData;
    }
    
    
  }
  
module.exports = CrosswordGenerator