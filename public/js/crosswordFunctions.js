//Clone panels or clone tD
export function CloneElement(document, idOfNewElement, idOfElementToClone, elemToAddOnto)
{ 
    // Get the element
    var elem = document.getElementById(idOfElementToClone);

    // Create a copy of it
    var clone = elem.cloneNode(true);

    // Update the ID and add a class
    clone.id = idOfNewElement;

    //elem.after(clone);
    elemToAddOnto.appendChild(clone);

    return elem;

}

//Add a row
export function AddElement(document, elementType, newId, idToAddOnto)
{ 
    // create a new div element and assign it an id
    var newElement = document.createElement(elementType);
    newElement.id = newId; 
    // and give it some content 
    //var newContent = document.createTextNode("Hi there and greetings!"); 
    // add the text node to the newly created div
    //newDiv.appendChild(newContent);  
  
    // add the newly created element and its content into the DOM 
    var oldElement = document.getElementById(idToAddOnto); 

    oldElement.appendChild(newElement);
    //insertAfter(newElement, oldElement);

    return newElement;
  }

//Hide panel if there's a "-"
export function ChangePanelVisibility(elem, character)
{
        if (character == "-") //Hide but still takes up space
        {
            elem.style.visibility = "hidden"; 
        }
        else if (character == ".") //Hide entirely
        {
            elem.style.display = "none"; 
        }
        else
        {
            elem.style.visibility = "visible";
        }

}


export async function FinishCrossword(layoutString, rowSize)
{


    //Make an array of all the input field data
    var inputString = "";
    var inputPanels = [];
    var x = 0;

    document.querySelectorAll('input[type="text"]').forEach(input => {

        if (input.value != "")
            inputString = inputString.concat(input.value[0]);
        else
            inputString = inputString.concat("-");
        inputPanels.push(input);

    });
    inputString = inputString.toLowerCase();

    var allCorrect = true;

    //Check if the input matches the layout string.
    for (let i = 0; i <rowSize; i++)
    {
        for (let j = 0; j <rowSize; j++)
        {
            let inputIndex = j + (i*rowSize);
            let layoutIndex = j + (i*rowSize) + 1; //The layout string is off by 1 for some reason. The original input element might throw it off?


            if (layoutString[layoutIndex] != "-")
            {
                console.log(layoutString[layoutIndex] + " vs " + inputString[inputIndex]);
                //If the letter matches, colour it green to indicate it
                if (layoutString[layoutIndex] == inputString[inputIndex])
                {
                    inputPanels[inputIndex].style.color = "green";
                    
                    console.log(inputPanels[inputIndex].style.color);
                }
                else if (inputString[inputIndex] && layoutString[layoutIndex]) //Make sure both are valid
                {
                    inputPanels[inputIndex].style.color = "black";
                    allCorrect = false;
                }
            }


        }
    }

    //If every single word is correct...
    if (allCorrect)
    {
        //Wait 2 seconds after everything's been hihglighted green.
        clearTimeout(timer);
        await Wait();

        //Congratulate the player and ask them to play again (redirect them to the main page)
        if (confirm("Nice! You got all the words within " + time.toString() + " seconds! Do another?")) {
            history.go(-1);
          } else {
            txt = "You pressed Cancel!";
          }
          
    }
}

//Replace a character at the given index. Javascript can't do this easily like other languages :P
export function ReplaceCharAt(string, index, replacement)
{
    return string.substr(0, index) + replacement + string.substr(index + replacement.length);
}

export function Wait() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('resolved');
      }, 2000);
    });
  }

  

//Global timer
var time = 0;
var timer = setInterval(Tick, 1000);

export function Tick()
{
    time += 1;
    document.getElementById("time").innerHTML = time.toString();
}

