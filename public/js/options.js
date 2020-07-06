document.addEventListener('DOMContentLoaded', () => {


    function getOption() {
        var obj = document.getElementById("mySelect");
        document.getElementById("demo").innerHTML = 
        obj.options[obj.selectedIndex].text;
      }

      var slider = document.getElementById("crosswordSize");
    var output = document.getElementById("sizeOutput");
    output.innerHTML = slider.value; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function() {
    output.innerHTML = this.value;
    }

});

