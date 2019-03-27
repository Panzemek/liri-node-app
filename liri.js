const fs = require('fs');
require("dotenv").config();
var moment = require("moment");
var Spotify = require("node-spotify-api");
var keys = require("./keys");
var inquirer = require("inquirer");
var axios = require("axios");
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

// Initial function run to begin the menu loop
whatDo();

// Functionality wrapped in a function in order to recur
function whatDo() {

    // Runs a list selection for user interface
    inquirer.prompt([
        {
            type: "list",
            message: "Whatcha wanna do?",
            choices: ["Look for concerts", "Get song info", "Get movie info", "Read from random.txt", "Quit"],
            name: "action"
        }
    ]).then(function (inqRes) {
        // Function for searching for concerts via a band input from user
        if (inqRes.action === "Look for concerts") {
            inquirer.prompt([
                {
                    type: "input",
                    message: "Enter the name of the band you want to search for:",
                    name: "band"
                }
            ])
                .then(function (bandName) {
                    var band = bandName.band;
                    // Handles blank input
                    if (band === "") {
                        console.log("\nYou didn't enter anything!  You get Aqua instead.");
                        band = "Aqua";
                    }

                    // Calls function to make API call and display results
                    getConcertInfo(band);
                });

        } else if (inqRes.action === "Get song info") {
            inquirer.prompt([
                {
                    type: "input",
                    message: "Enter the name of the song you want to search for:",
                    name: "song"
                }
            ])
                .then(function (songName) {
                    var song = songName.song;
                    // Handles blank input
                    if (song === "") {
                        console.log("\nYou didn't enter anything!  You get Barbie Girl instead.");
                        song = "Barbie Girl";
                    }

                    // Calls function to make API call and display results
                    getSpotifyInfo(song);
                });

        } else if (inqRes.action === "Get movie info") {
            inquirer.prompt([
                {
                    type: "input",
                    message: "Enter the name of the movie you want to search for:",
                    name: "movie"
                }
            ])
                .then(function (movieName) {
                    var movie = movieName.movie;

                    // Handles blank input
                    if (movie === "") {
                        console.log("\nYou didn't enter anything!  You get Barbie instead.");
                        movie = "Barbie";
                    }

                    // Calls function to make API call and display results
                    getMovieInfo(movie);

                });

        } else if (inqRes.action === "Read from random.txt") {
            // Performs functions based on textfile input, using the call format specified in the assignment
            fs.readFile("./random.txt", "utf8", function (err, data) {
                var randomText = data.split(",")
                if (randomText[0] === "concert-this") {
                    getConcertInfo(randomText[1]);
                } else if (randomText[0] === "spotify-this-song") {
                    getSpotifyInfo(randomText[1]);
                } else if (randomText[0] === "movie-this") {
                    getMovieInfo(randomText[1]);
                }
            })

            // Allows user to terminate menu loop
        } else if (inqRes.action === "Quit") {
            return;
        }
    });

}

function getConcertInfo(band) {
    var qUrl = "https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp";

    axios.get(qUrl).then(function (response) {
        console.log("\n");
        for (i = 0; i < response.data.length; i++) {
            console.log(" " + response.data[i].venue.name);
            console.log(" " + response.data[i].venue.city + " " + response.data[i].venue.region + ", " + response.data[i].venue.country);
            console.log(" " + moment(response.data[i].datetime).format("L") + "\n");
        };

    }).catch(function (error) {
        console.log(error);
    }).then(whatDo); // Recurs menu options
}

function getSpotifyInfo(song) {
    spotify
        // Note: Set to return only the top search result for the song name provided.
        .search({ type: 'track', query: song, limit: 1 })
        .then(function (response) {
            console.log("\n Artist: " + response.tracks.items[0].artists[0].name);
            console.log(" Song Name: " + response.tracks.items[0].name);
            console.log(" Spotify preview: " + response.tracks.items[0].preview_url);
            console.log(" Album: " + response.tracks.items[0].album.name + "\n");
        })
        .catch(function (err) {
            console.log(err);
        }).then(whatDo); // Recurs menu options
}

function getMovieInfo(movie) {
    var qUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    axios.get(qUrl).then(function (response) {
        var movieAPI = response;
        console.log("\n Title: " + movieAPI.data.Title);
        console.log(" Year: " + movieAPI.data.Year);
        console.log(" IMDB Rating: " + movieAPI.data.imdbRating);
        console.log(" Rotten Tomatoes: " + movieAPI.data.Metascore);
        console.log(" Country: " + movieAPI.data.Country);
        console.log(" Language: " + movieAPI.data.Language);
        console.log(" Plot: " + movieAPI.data.Plot);
        console.log(" Actors: " + movieAPI.data.Actors + "\n");
    }).catch(function (error) {
        console.log(error);
    }).then(whatDo); // Recurs menu options
}