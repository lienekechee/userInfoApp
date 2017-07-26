/*User Information App - Web Server

Create a Node.js application that is the beginning 
of a user management system. Your users are all saved 
in a "users.json" file, and you can currently do the following:
- search for users
- add new users to your users file.
- get your starter file here: users.jsonView in a new window

Part 0
Create one route:
- route 1: renders a page that displays all your users.\


Part 1
Create two more routes:
- route 2: renders a page that displays a form which is your search bar.
- route 3: takes in the post request from your form, then displays 
matching users on a new page. Users should be matched based on whether 
either their first or last name contains the input string.

Part 2
Create two more routes:
- route 4: renders a page with three forms on it (first name, last name, and email) 
that allows you to add new users to the users.json file.
- route 5: takes in the post request from the 'create user' form, 
then adds the user to the users.json file. Once that is complete, 
redirects to the route that displays all your users (from part 0).*/

var express = require("express")
var app = express()
var fs = require("fs")
var bodyParser = require("body-parser")
var pug = require("pug")

app.set("views", "src/views")
app.set("view engine", "pug")
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); //true accpet any data type

// GET INDEX WITH USERS
app.get("/", function(req, res) {
    fs.readFile("src/users.json", function(error, data) {
        if (error) {
            throw error
        }

        var parsedData = JSON.parse(data)
        var userData = parsedData
        console.log(parsedData)

        res.render("index", {userData: userData});

    });
});

//GET SEARCH FORM
app.get("/search", function(req, res) {
    res.render("search")
})

//POST SEARCH QUERY TO DATABASE TO CHECK FOR MATCH
app.post("/searchUser", function(req, res) {
    fs.readFile("src/users.json", function(error, data) {
        if (error) {
            throw error
        }

        var parsedData = JSON.parse(data)
        var userData = parsedData
            //this route renders a page that display users input into the search bar that match to 
            //those on the database.

        var match = ""
        for (i = 0; i < userData.length; i++) {

            if (req.body.usersearch === userData[i].firstname || req.body.usersearch === userData[i].lastname) {
                console.log(userData[i])

               match = userData[i]
            }

        }
        // return res.send('User Not Found');
        res.render("match", {searchResult: match});
    })

})

//GET NEW USER FORM
app.get("/newUser", function(req, res) {
	res.render ("newUserForm")

})

//POST NEW USERS TO JSON FILE
app.post("/addUser", function (req, res){
	fs.readFile("src/users.json", function(error, data) {
        if (error) {
            throw error
        }
//
        var parsedData = JSON.parse(data)
        console.log (parsedData)
        var newUserData = req.body
        console.log (newUserData)
       
        parsedData.push(newUserData);
        console.log (parsedData);
        var newJSON = JSON.stringify(parsedData);
        console.log(newJSON);

        fs.writeFile("src/users.json", newJSON, function (err){
        	if (err){

                throw err
        	}

        	res.redirect("/")
        })

	})
})

//GET AUTOCOMPLETE FROM DATABASE
app.get("/autocomplete", function(req, res) {
    fs.readFile("src/users.json", function(error, data) {
        if (error) {
            throw error
        }

        var parsedData = JSON.parse(data)

var input = req.query.input; 
console.log (input); 

var matchingUsers = []
  //if statement req.query.input = " "/ null then matchingUsers = []
if (req.query.input == ""){
    matchingUsers == []
}


//.toLowerCase employed for both input and parsedData keys to creat case-insensitivity.
else{
    for (var i = 0; i < parsedData.length; i++){
        if(parsedData[i].firstname.toLowerCase().indexOf(input.toLowerCase()) !== -1 || parsedData[i].lastname.toLowerCase().indexOf(input.toLowerCase()) !== -1){
            matchingUsers.push(parsedData[i].firstname + " " + parsedData[i].lastname)
            
        } 




        console.log (matchingUsers)
    }
}
    
res.send ({matchingUsers: matchingUsers})

    });
});
        


//

//parse the JSON file, append new user to parsed file, then writefile to overwirte
// //old JSON file.  then you need to use stringify to convert the parsed data back to
// JSON format.

//route 4 should take three inputs from a form and add a new users to the users.json
//each input field is the key to an object

// var newUser = {first}


app.listen(3000, function() {
    console.log("listening on port 3000")
})


/* RECAP: ROUTING misconceptions and Learning points

Routes are endpoints or targets.  They are a set of statements that define
server routes, endpoints and pages. According to Evan Hahn it routing is a way 
to map different requests to different handlers.  In a big city that represents your code
the buildings are a endpoints that people want to visit.  The base route 
can be understood as the mainroad or entry point into the city, and 
the subsequent routes define all other potential destinations withint the
city of code.  In this case, the homepage, displays a database of users.
From here the client may want to either search the users or register a new user.
These two options represent two new routes.  Thus a search route is set up
that directs the client to a search page which includes a form (a get request).  The display of 
this form is the conclusion, or endpoint of the get request that is triggered when a
client presses a button that is labelled "search users".  The form that occurs
as endpoint of this particular request subequently offers the potential for the triggering
of a post request, which will occur when a user completes and submits info
via the form.  The post request takes in the data from the form and processes this data
using a JS function that checks it against existing data in the JSON file.  From this
point two outcomes are possible- either a match is found, in which case the user will be
displayed to the client, or the match is not found, in which a not foudn message is
displayed to the client.  The route is what leads us to either endpoint.

The confusing part of routing is that is seems that each route should end in a specific page, i.e.
a clear location represented by a URL. These are examples of direct routes, like the base route
which displays an HTML page when a user makes a request for the homepage.
However routes can also be a lot more complicated than simply directing us to a page.  For example 
after filling in a form and submitting information, a route can be set up to load a function that
processes the data in one way or another and then redirects us to a new page, or merely sends us
some information.  The routes are essentially what we use to manage the functionality of our webapplicaiton.
Evan Hahn describes the HTTP server as the bottom layer, this is the basic funcitonality
of listening for requests and establishing communication between client and server i.e. requests
and responses.  the middle layer is the middleware.  these request handling funcitons allow two
programming languages to work together.   Routing is the top level layer, "the peak of abstration mountain",
in which we are able to manipulate   The app.get/.posts are express's routing system.  These mechanisms
perform pre-conditions that then pass control to subsequent routes when there is reason to proceed.s*/











