/*
Author : Robert Jackson
Date: 04/25/15
Class: CS290
*/

//some date stuff for git requests
var dateOff = (  60 * 1000); // minute
var d = new Date();
d.setTime(d.getTime() - dateOff);
gitDate = d.toISOString();

var gitURL = 'https://api.github.com/gists/public?per_page=';
var respArray = [];

function connect(url) {

    //did we get anything
    if (!url) {
        url = gitURL + localStorage.getItem('per_page') + '&page='+localStorage.getItem('page') ;
    }

    var req = new XMLHttpRequest();

    // make sure it got somewhere
    if (!req){
        alert('Something broke with the request to ' + url);
    }

    req.onreadystatechange = state;
    req.open('GET', url);
    req.send();


    function state() {
        //Check the state
        if (req.readyState === 4) {
            //check the response
            if (req.status === 200) {
                // everything is good, the response is received
                response = JSON.parse(req.responseText);
                localStorage.setItem('firstrep', response);
                if (response !== '') {
                    console.log('I have a response');
                    //depending on how we set the url, we may need to change the object

                    dispArray(arrayG(response), 'gists');
                    dispArray(JSON.parse(localStorage.getItem('favs')), 'favs');
                    return response;
                }
            } else {

                console.log('Received a response other than 200');
                alert('Something broke with the request to ' + url);
                console.log(req.statusText);
            }
        }
    }
}
function subFav(testvar) {
    console.log(testvar)
}
function addFav(sender, math) {
    var fav = [];
    var g = [];
    if(math == 'add'){
        if (!localStorage.getItem('favs') || localStorage.getItem('favs') == '') {

            fav.push(g[sender.target.id] = new Gist(respArray[sender.target.id].url, respArray[sender.target.id].desc, respArray[sender.target.id].lang, sender.target.id));
            localStorage.setItem('favs', JSON.stringify(fav));
            document.getElementById(sender.target.id).parentElement.style.display = "none";

            //remove the pointer from our array
            delete respArray[sender.target.id];
            dispArray(JSON.parse(localStorage.getItem('favs')), 'favs');

        } else {
            fav = JSON.parse(localStorage.getItem('favs'));

            //add it to the favorites if it's not already there
            if (fav.indexOf(sender.target.id) === -1) {

                //push it and store it locally
                fav.push(g[sender.target.id] = new Gist(respArray[sender.target.id].url, respArray[sender.target.id].desc, respArray[sender.target.id].lang, sender.target.id));
                localStorage.setItem('favs', JSON.stringify(fav)); //add locally

                //remove the pointer from our array
                delete respArray[sender.target.id];

                //hide it from the display
                document.getElementById(sender.target.id).parentElement.style.display = "none";

                //update the display
                dispArray(JSON.parse(localStorage.getItem('favs')), 'favs');

            } else {
                alert('That is already in your favorites');
            }
        }
    }else{
            // Were removing things from the favs
            fav = JSON.parse(localStorage.getItem('favs'));

            // inn is the object that is going to be added back
            var inn = fav.filter(function(item){
                return item.id == sender.target.id;
            });
            //out rebuilds teh arry taking the selected id out
            var out = fav.filter(function(item){
                return item.id !== sender.target.id;
            });
            //put the array back in local storage
            localStorage.setItem('favs', JSON.stringify(out));
            //update the display
            dispArray(JSON.parse(localStorage.getItem('favs')), 'favs');

            //hide it from the display FIRST
            //document.getElementById(sender.target.id).parentElement.style.display = "none";

            //put it back in the resparray unless it's already there
            if (respArray.indexOf(sender.target.id) === -1) {
                respArray[inn[0].id] = new Gist(inn[0].url, inn[0].desc, inn[0].lang, inn[0].id);
                dispArray(respArray, 'gists');
            }

        }

}

//Constructor funciton to make a list ob objects
function Gist(url, desc, lang, id) {
    this.url = url;
    this.desc = desc;
    this.lang = lang;
    this.id = id;
}


// Makes an Array out of the textresponse.
//@param a JSON.parse of the responseText
function arrayG(rsp) {

    respArray = [];
    rsp.forEach(function (rowData) {

        for (file in rowData.files) {
            var languages = [];

            if(rowData.files.hasOwnProperty(file))
                languages.push(rowData.files[file].language);
        }

        respArray[rowData.id] = new Gist(rowData.html_url, rowData.description, languages, rowData.id);

    });

    return respArray;
}
//Displays the Array from ArrayG
//@param array = A Json.parsed  array;
//@param where  = what parent element in the DOM
function dispArray(array, where) {

    document.getElementById(where).innerHTML = '';

    //start the list
    var display = document.getElementById(where);
    var list = document.createElement("ul");

    //loop over the array and generate the html
    for (key in array) {

        var row = document.createElement("li");

        //The link to the actual GIST
        var rowLink = document.createElement("a");
        rowLink.href = array[key].url;
        rowLink.className = 'gitLink';
        rowLink.target = "_blank";

        // Description changed if it's empty.
        var fileDesc = document.createTextNode(array[key].desc);
        if (array[key].desc === '' || array[key].desc === null) {
            fileDesc = document.createTextNode('No Description Entered')
        }
        /// A link to add stuff to the Fav list
        var addtoFav = document.createElement("a");
        //Something to switch the outcome based on where it was clicked i=either in favs or gitsts
        if(where === 'gists'){
            addtoFav.onclick = function (f) {
                addFav(f, 'add');
            }
        }else {
            addtoFav.onclick = function (f) {
                addFav(f, 'sub');
            };
        }
        addtoFav.href = "javascript:void(0)";
        addtoFav.className = "addLink";
        addtoFav.id = array[key].id;
        if(where === 'gists'){
            var addtoFavLink = document.createTextNode(' + ');
        }else {
            var addtoFavLink = document.createTextNode(' - ');
        }


        //Appendages
        addtoFav.appendChild(addtoFavLink);
        row.appendChild(rowLink);
        rowLink.appendChild(fileDesc);
        row.appendChild(addtoFav);
        list.appendChild(row);
    }
    //finally add all that to the top element
    display.appendChild(list);

}


function filterOn(clear) {
    var newurl = '';

    if (!clear) {
        var filters = [];

        //Figure out what languages are selected add to an array
        langu = document.getElementsByName('language');
        for (i in langu) {
            if (langu[i].checked)
                filters.push(langu[i].value)
        }

        //Determine the id's to filter out
        var ids = [];

        for (item in respArray){
            document.getElementById(respArray[item].id).parentElement.style.display = "none"; // hide all first

            for( lang in filters){
                //if the language has one from our array push it
                if(respArray[item].lang.indexOf(filters[lang]) >= 0){
                    ids.push(respArray[item].id);
                }
            }
        }
        //loop the ID's and change their displaysetting
        ids.forEach(function(aid){

            document.getElementById(aid).parentElement.style.display = "";
        })

    } else {
        //clear filter was set show em all
        for (item in respArray) {
            document.getElementById(respArray[item].id).parentElement.style.display = "";
        }
    }
}

function setPPage() {

    localStorage.setItem('per_page', document.getElementById('per_page').value);
    localStorage.setItem('page', document.getElementById('page').value);
    connect();
}

window.onload = function () {

    console.log('Connecting...');
    connect('https://api.github.com/gists/public?per_page=' + localStorage.getItem('per_page'));
    if(!localStorage.getItem('page')){localStorage.setItem('page', 1)}
    if(!localStorage.getItem('per_page')){localStorage.setItem('per_page', 30)}
    document.getElementById('page').value = localStorage.getItem('page');
    document.getElementById('per_page').value = localStorage.getItem('per_page');


};

//document.getElementById("connectButton").onclick =function(){connect();};