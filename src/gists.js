/*
 Author : Robert Jackson
 Date: 04/25/15
 Class: CS290
 */

//some date stuff for git requests
var dateOff = (  60 * 1000);
var d = new Date();
d.setTime(d.getTime() - dateOff);
gitDate = d.toISOString();

var gitURL = 'https://api.github.com/gists/public?per_page=';
var responsObj = [];


//Initiates the connection to the url provided;
// CAuses the display to take place once loaded
//@param url URL to be passed
function connect(url) {

    //did we get anything
    if (!url) {
        url = gitURL + localStorage.getItem('per_page') + '&page=' + localStorage.getItem('page');
    }

    var req = new XMLHttpRequest();

    // make sure it got somewhere
    if (!req) {
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
                    dispArray(JSON.parse(localStorage.getItem('favs')), 'favorites');
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
//Adds or subtracts from the appropriate list
//@param sender is the variable set by the item that caled the function.
//@param math If math is set to add it will add to favorites otherwise it subtracts from the favorites
function addFav(sender, math) {
    var fav = [];
    var g = [];
    if (math == 'add') {
        if (!localStorage.getItem('favs') || localStorage.getItem('favs') == '') {
            console.log(sender);
            fav.push(g[sender.target.id] = new Gist(responsObj[sender.target.id].url, responsObj[sender.target.id].desc, responsObj[sender.target.id].lang, sender.target.id));
            localStorage.setItem('favs', JSON.stringify(fav));
            document.getElementById(sender.target.id).parentElement.style.display = "none";

            //remove the pointer from our array
            delete responsObj[sender.target.id];
            dispArray(JSON.parse(localStorage.getItem('favs')), 'favorites');

        } else {
            fav = JSON.parse(localStorage.getItem('favs'));

            //add it to the favorites if it's not already there
            if (fav.indexOf(sender.target.id) === -1) {

                //push it and store it locally
                fav.push(g[sender.target.id] = new Gist(responsObj[sender.target.id].url, responsObj[sender.target.id].desc, responsObj[sender.target.id].lang, sender.target.id));
                localStorage.setItem('favs', JSON.stringify(fav)); //add locally

                //remove the pointer from our array
                delete responsObj[sender.target.id];

                //hide it from the display
                document.getElementById(sender.target.id).parentElement.style.display = "none";

                //update the display
                dispArray(JSON.parse(localStorage.getItem('favs')), 'favorites');

            } else {
                alert('That is already in your favorites');
            }
        }
        //WE're going to Subtract it from Favs and Add bak to the resp Object
    } else {
        // Were removing things from the favs
        fav = JSON.parse(localStorage.getItem('favs'));

        // inn is the object that is going to be added back
        var inn = fav.filter(function (item) {
            return item.id == sender.target.id;
        });
        //out rebuilds teh arry taking the selected id out
        var out = fav.filter(function (item) {
            return item.id !== sender.target.id;
        });
        //put the array back in local storage
        localStorage.setItem('favs', JSON.stringify(out));
        //update the display
        dispArray(JSON.parse(localStorage.getItem('favs')), 'favorites');

        //hide it from the display FIRST
        //document.getElementById(sender.target.id).parentElement.style.display = "none";

        //put it back in the responsObj unless it's already there
        if (responsObj.indexOf(sender.target.id) === -1) {
            responsObj[inn[0].id] = new Gist(inn[0].url, inn[0].desc, inn[0].lang, inn[0].id);
            dispArray(responsObj, 'gists');
        }

    }

}

//Constructor funciton to make  gist objects

function Gist(url, desc, lang, id) {
    this.url = url;
    this.desc = desc;
    this.lang = lang;
    this.id = id;
}


// Makes an Array out of the textresponse.
//@param rsp a JSON.parse of the responseText
function arrayG(rsp) {

    responsObj = [];
    rsp.forEach(function (rowData) {

        for (file in rowData.files) {
            var languages = [];

            if (rowData.files.hasOwnProperty(file))
                languages.push(rowData.files[file].language);
        }

        responsObj[rowData.id] = new Gist(rowData.html_url, rowData.description, languages, rowData.id);

    });

    return responsObj;
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
    //for (key in array) {
    Object.keys(array).forEach(function (key) {

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

        // A link to add stuff to the Fav list
        var addtoFav = document.createElement("a");

        //Something to switch the outcome based on where it was clicked i=either in favs or gitsts
        if (where === 'gists') {
            addtoFav.onclick = function (f) {
                addFav(f, 'add');
            }
        } else {
            addtoFav.onclick = function (f) {
                addFav(f, 'sub');
            };
        }
        addtoFav.href = "javascript:void(0)";
        addtoFav.className = "addLink";
        addtoFav.id = array[key].id;
        if (where === 'gists') {
            var addtoFavLink = document.createTextNode(' + ');
        } else {
            var addtoFavLink = document.createTextNode(' - ');
        }

        //Appendages
        addtoFav.appendChild(addtoFavLink);
        row.appendChild(rowLink);
        rowLink.appendChild(fileDesc);
        row.appendChild(addtoFav);
        list.appendChild(row);
    });
    //finally add all that to the top element
    display.appendChild(list);

}
//Invokes the filtering by
//@param clear If set to anything else other than clear will filter
//if set to clear it will clear the filters.
function filterOn(clear) {

    if (!clear) {
        var filters = []; // holder the languages from the html page
        var ids = []; //Determine the id's to filter out

        //Figure out what languages are selected add to an array
        langu = document.getElementsByName('language');
        for (var i = 0; i < langu.length; i++) {

            if (langu[i].checked) {
                filters.push(langu[i].value)
            }
        }

        Object.keys(responsObj).forEach(function (key) {
            document.getElementById(responsObj[key].id).parentElement.style.display = "none"; // hide all first

            filters.forEach(function (fKey) {
                //if the language has one from our array push it
                if (responsObj[key].lang.indexOf(fKey) >= 0) {
                    ids.push(key);
                }
            });
        });
        //loop the ID's and change their displaysetting
        ids.forEach(function (aid) {

            document.getElementById(aid).parentElement.style.display = "";
        })

    } else {
        //clear filter was set show em all
        Object.keys(responsObj).forEach(function (key) {

            document.getElementById(responsObj[key].id).parentElement.style.display = "";
        });

    }
}

//sets the page and per page values based on what is in the HTML
//Note it does invoke the connect function to get a new set of data
function setPPage() {

    if (!localStorage.getItem('page') || localStorage.getItem('page') === "") {
        localStorage.setItem('page', 1);
        document.getElementById('page').value = 1;
    } else {
        localStorage.setItem('page', document.getElementById('page').value);
    }

    if (!localStorage.getItem('per_page') || localStorage.getItem('per_page') === "") {
        localStorage.setItem('per_page', 30);
        document.getElementById('per_page').value = 30;
    } else {
        localStorage.setItem('per_page', document.getElementById('per_page').value);
    }

    connect();
}

window.onload = function () {

    console.log('Connecting...');
    setPPage();

};
