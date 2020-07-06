//Import function file
import {CloneElement,
    AddElement,
    ChangePanelVisibility,
    RemoveUneededColumns,
    FinishCrossword,
    ReplaceCharAt,
    Wait,
    Tick

} from './crosswordFunctions.js';

document.addEventListener('DOMContentLoaded', () => {

    //String that says what the layout of the table is
    var layoutString = document.getElementById("layout").innerHTML;
    var rowSize = document.getElementById("rowSize").innerHTML;

    //Numbers to label each word
    var numberData = document.getElementById("number").innerHTML;
    var numberArray = JSON.parse("[" + numberData + "]");

    //Dynamically add input panels to the crossword. This lets us use any grid size.
    for (let i = 0; i <rowSize; i++)
    {
        let rowId ="row"+i.toString();

        //Add a new row
        if (i > 0)
        AddElement(document, "tr", rowId, "t");

        let emptyRow = true;
        let rowPanels = [];

        for (let j = 0; j <rowSize; j++)
        {
            
            //First time you ignore the first element (We need it for cloning)
            if (j == 0 && i == 0)
            {
                ChangePanelVisibility(document.getElementById("0"), layoutString[j+(i*rowSize)]);
                continue;
            }

            
            //Add A <TD>
            let td = AddElement(document, "td", "td"+((j+(i*rowSize)).toString()), rowId);

            //Get ids for cloning
            let newId = (j+(i*rowSize)).toString();
            let oldId = ((j+(i*rowSize))-1).toString();

            let newPanel = CloneElement(document, newId, oldId, td);

            //Make "-" invisble
            ChangePanelVisibility(newPanel, layoutString[j+(i*rowSize)]);

            //Display the number that the word is.
            let number = numberArray[j+(i*rowSize)];
            if (number != 0)
            {
                newPanel.placeholder = number.toString();
                //Multi digit numbers are sharing stuff
                if (number > 9)
                {
                    let num0 = newPanel.placeholder[0];
                    let num1 = newPanel.placeholder[1];
                    newPanel.placeholder = num0.concat("/",num1);
                }
            }
            
            

            //Record variables to make entire row invisible later
            rowPanels.push(newPanel);
            if(layoutString[j+(i*rowSize)] != "-") emptyRow = false;
        }

        //Hide empty rows (But) keep first and last row regardless
        if (emptyRow && i > 0 && i < rowSize-1)
        {
            for (let j = 0; j <rowSize; j++)
            {
                ChangePanelVisibility(rowPanels[j], ".");
            }
        }
        
    }

    RemoveUneededColumns(document, layoutString, rowSize);

    //Find all buttons
    document.querySelectorAll('button').forEach(button => {
        
    //Click a button to show information of a website/game.
        if (button.className == "finish")
        {
            button.onclick = () => {
                FinishCrossword(layoutString, rowSize);
            }

        }
        else if (button.className == "cheat")
        {
            //Cheat buttons
            button.onclick  = () => {

                button.nextElementSibling.style.display = "block";
                button.nextElementSibling.innerHTML = button.nextElementSibling.innerHTML.toUpperCase();
                button.style.display = "none";
            }
        }
        
    });


});
