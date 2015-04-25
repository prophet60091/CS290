//some date stuff for git requests
var dateOff = (  60 * 1000); // minute
var d = new Date();
d.setTime(d.getTime() - dateOff);
gitDate = d.toISOString();

var gitURL = 'https://api.github.com/gists/public';
var respArray = [];


function connect(url) {

    //did we get anything
    if (!url) {
        url = 'https://api.github.com/gists/public?per_page=' + localStorage.getItem('per_page');
    }

    var req = new XMLHttpRequest();

    // make sure it got somewhere
    if (!req)console.log('Something broke with the request to ' + url);

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

                    dispArray(arrayG(response), 'arrayVersion');
                    dispArray(JSON.parse(localStorage.getItem('favs')), 'favs');
                    return response;
                }
            } else {

                console.log('Received a response other than 200');
                console.log(req.statusText);
            }
        }
    }
}

function addFav(sender) {
    var fav = [];
    var g = [];

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
            alert('That is already in your favorites')
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

    var fileLang;

    rsp.forEach(function (rowData) {

        for (file in rowData.files) {
            var languages = [];

            if(rowData.files.hasOwnProperty(file))
                languages.push(rowData.files[file].language);
        }

        if (languages.length >= 1) {
            fileLang = languages.join(', ')
        } else {
            fileLang = 'n/a'
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
        addtoFav.onclick = addFav;
        addtoFav.href = "javascript:void(0)";
        addtoFav.className = "addLink";
        addtoFav.target = "_blank";
        addtoFav.id = array[key].id;
        var addtoFavLink = document.createTextNode(' + ');

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


function filter(clear) {
    var newurl = '';


    if (!clear) {
        var filters = [];
        var pages;

        langu = document.getElementsByName('language');
        //gather up which filters are needed
        for (i in langu) {
            if (langu[i].checked)
                filters.push(langu[i].value)

        }
        //if there are filters add them to the request
        if (filters.length >= 1) {

            newurl = 'https://api.github.com/gists/public?q=';
            newurl += 'language=';
            var languages = filters.join(' OR ');
            newurl += encodeURIComponent(languages);
            newurl += '&per_page=' + localStorage.getItem('per_page');
            console.log(newurl);
        }

        console.log(newurl);
        connect(newurl);
        //newurl += 'per_page=' + per_page;
        //if the page changed add that too api.github.com/search/repositories?q=

    } else {
        connect();

    }

}

function setPPage() {

    localStorage.setItem('per_page', document.getElementById('pages').value);
    connect();
}

window.onload = function () {

    console.log('Connecting...');
    connect('https://api.github.com/gists/public?per_page=' + localStorage.getItem('per_page'));
    document.getElementById('pages').value = localStorage.getItem('per_page');


};

//document.getElementById("connectButton").onclick =function(){connect();};