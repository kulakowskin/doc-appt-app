var bedroom1 = document.getElementById("bedroom1");
var bedroom2 = document.getElementById("bedroom2");
var master = document.getElementById("master");
var office = document.getElementById("office");
var livingRoom = document.getElementById("livingRoom");
var indoorTemp = document.getElementById("indoorTemp");
var setTemp = document.getElementById("setTemp");
var selected;

var increase = document.getElementById("increaseTemp");
var decrease = document.getElementById("decreaseTemp");

var errModal = document.getElementById("errModal");
var span = document.getElementsByClassName("close")[0];


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    errModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == errModal) {
        errModal.style.display = "none";
    }
}

/****
Change the set temperature
**/
decrease.onclick = function() {
    if(!selected){
        errModal.style.display = "block";
    }
    var temp = setTemp.innerHTML.slice(0,-2);
    temp = parseInt(temp, 10) - 1;
    setTemp.innerHTML = temp+"&degF";

    updateSelectedTemperature(temp)
}

increase.onclick = function() {
    if(!selected){
        errModal.style.display = "block";
    }
    var temp = setTemp.innerHTML.slice(0,-2);
    temp = parseInt(temp, 10) + 1;
    setTemp.innerHTML = temp+"&degF";

    updateSelectedTemperature(temp)
}

/****
 Adjust temperature of selected room
 **/
function updateSelectedTemperature(newTemp){
    currentTemp = selected.getElementsByTagName("p")[0].innerHTML.slice(0,-2)
    console.log("current: "+currentTemp);
    console.log("newTemp:" + newTemp);
    if (currentTemp > newTemp) {
        selected.style.background = "#49a5ff";
        selected.style.color = "white";
    }
    else if (currentTemp < newTemp) {
        selected.style.background = "#ff5a47";
        selected.style.color = "white";
    }
    else // must be equal
    {
        selected.style.background = "whitesmoke";
        selected.style.color = "black";
    }
}


/****
 Change the selected rooms
 **/
function updateSelected(newRoom){
    if (selected){
        selected.classList.remove("currentRoom");
    }
    selected = newRoom;
    newRoom.classList.add("currentRoom");
}

bedroom2.onclick = function() {
    updateSelected(bedroom2)
    indoorTemp.innerHTML = document.getElementById("bedroom2Temp").innerHTML;
    setTemp.innerHTML = document.getElementById("bedroom2Temp").innerHTML;
}

livingRoom.onclick = function() {
    updateSelected(livingRoom)
    indoorTemp.innerHTML = document.getElementById("livingRoomTemp").innerHTML;
    setTemp.innerHTML = document.getElementById("livingRoomTemp").innerHTML;
}

bedroom1.onclick = function() {
    updateSelected(bedroom1)
    indoorTemp.innerHTML = document.getElementById("bedroom1Temp").innerHTML;
    setTemp.innerHTML = document.getElementById("bedroom1Temp").innerHTML;
}

office.onclick = function() {
    updateSelected(office)
    indoorTemp.innerHTML = document.getElementById("officeTemp").innerHTML;
    setTemp.innerHTML = document.getElementById("officeTemp").innerHTML;
}

master.onclick = function() {
    updateSelected(master)
    indoorTemp.innerHTML = document.getElementById("masterTemp").innerHTML;
    setTemp.innerHTML = document.getElementById("masterTemp").innerHTML;
}

