
//some date stuff for git requests
var dateOff = (  60 * 1000); // minute
var d = new Date();
d.setTime(d.getTime() - dateOff);
gitDate = d.toISOString();
var per_page = 30;
var gitURL = 'https://api.github.com/gists/public';

function connect(url, queryType) {

    //did we get anything
    if(!url){
        url = 'https://api.github.com/gists/public?per_page=' + per_page ;
    }

    var req = new XMLHttpRequest();

    // make sure it got somewhere
    if (!req)console.log( 'Something broke with the request to ' +  url);

    req.onreadystatechange = state;
    req.open('GET', url);
    req.send();


    function state() {
        //Check the state
        if (req.readyState === 4) {
            //check the response
            if (req.status === 200) {
                // everything is good, the response is received
                console.log("it works");
                response = JSON.parse(req.responseText);

                if(response !== '') {
                    console.log('I have a response');
                    //depending on how we set the url, we may need to change the object

                    displayGists(response, 'gists');
                    return response;
                }
            }else{

                console.log('Received a response other than 200');
                console.log(req.statusText);
            }
        }
    }
}

function addFav() {


}




//grabs relevant data in the response
//@param rsp, takes a XMLHTTPResponse object
//@param where, where to display the list i.e favorites or
function displayGists(rsp, where) {

        if(!rsp){ rsp = connect().response}
        if(!where){where = 'gists'}
        //clear out the space
        //allowing successive calls to replace existing data
        document.getElementById(where).innerHTML = '';

        //start the list
        var display = document.getElementById("gists");
        var list = document.createElement("ul");

            console.log(rsp);
            rsp.forEach(function (rowData) {

                var row = document.createElement("li");

                var rowLink = document.createElement("a");
                    rowLink.href = rowData.html_url;
                    rowLink.className = 'gitLink';
                    rowLink.target = "_blank";

                var fileDesc = document.createTextNode(rowData.description);
                if(rowData.description === '' || rowData.description === null){
                    fileDesc = document.createTextNode('No Decription Entered')
                }
                var addtoFav = document.createElement("a");
                    addtoFav.onclick = addFav;
                    addtoFav.className = "addLink";
                    addtoFav.target = "_blank";
                    addtoFav.id = rowData.id;
                    var addtoFavLink = document.createTextNode(' + ');
                    addtoFav.appendChild(addtoFavLink);

                    //addtoFav.appendChild(document.createTextNode('Add'));

                     //fileDesc.appendChild(addtoFav);
                //var cell_date = document.createTextNode( rowData.updated_at );
                /*var listFiles = document.createElement("ul");

                //Grab the file Names and Info
                for (file in rowData.files) {

                    var rowFiles = document.createElement("li");
                    var fileName = document.createElement("div");
                        fileName.className = "fileName";
                        fileName.innerHTML = rowData.files[file].filename;

                    var fileLink = document.createElement("a");
                        fileLink.href = rowData.files[file].raw_url;
                        fileLink.class = "fileLink";

                    var fileLang = document.createTextNode(rowData.files[file].language);
                    rowFiles.appendChild(fileName);
                    //rowFiles.appendChild(fileLink);
                    rowFiles.appendChild(fileLang);
                    listFiles.appendChild(rowFiles);
                }
                */

                row.appendChild(rowLink);

                rowLink.appendChild(fileDesc);
                //rowLink.insertBefore(addtoFav, fileDesc);
                row.appendChild(addtoFav);
                //row.appendChild(listFiles);
                list.appendChild(row);
            });
            //put in the retunred information
            display.appendChild(list);

}

//function addLang(){
//
//
//    rsp.forEach(function (rowData) {
//
//        //grab the file Names and Info
//        for (file in rowData.files) {
//
//            var fileLang = document.createTextNode(rowData.files[file].language);
//
//    });
//
//
//}

function filter(clear){
    var newurl = '';


    if(!clear) {
        var filters = [];
        var pages;

        langu = document.getElementsByName('language');
        //gather up which filters are needed
        for (i in langu) {
            if (langu[i].checked)
                filters.push(langu[i].value)

        }
        //if there are filters add them to the request
        if (filters.length >= 1 ) {

            newurl = 'https://api.github.com/gists/public?q=';
            newurl += 'language=';
            var languages  = filters.join(' OR ');
            newurl += encodeURIComponent(languages);
            newurl += '&per_page=' + per_page;
            console.log(newurl);
        }

        console.log(newurl);
        connect(newurl);
        //newurl += 'per_page=' + per_page;
        //if the page changed add that too api.github.com/search/repositories?q=

    }else{
        connect();

    }

}

function setPPage(){

    per_page = document.getElementById('pages').value;
    connect();
}

window.onload = function(){
   console.log('Connecting...');


   connect('https://api.github.com/gists/public?per_page='+ per_page);

    document.getElementById('pages').value = per_page ;
    //displayGists(response, 'gists');

};

//document.getElementById("connectButton").onclick =function(){connect();};