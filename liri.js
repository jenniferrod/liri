// load modules
require("dotenv").config();
const keys = require('./keys.js');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');
const fs = require('fs');


// node inputs
const action = process.argv[2];
const input = process.argv[3];

// LIRI OPTIONS
switch (action) {
    case 'my-tweets':
        showTweets();
        break;
    case 'spotify-this-song':
        spotifySong(input);
        break;
    case 'movie-this':
        movieThis(input);
        break;
    case 'do-what-it-says':
        doWhatItSays();
        break;
    default:
        console.log("Sorry, LIRI doesn't know that");
}

// FUNCTIONS
// Twitter -------------------
function showTweets() {
    const client = new Twitter(keys.twitterKeys);

    const params = { screen_name: 'jennniferrod' };

    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (let i = 0; i < tweets.length; i++) {
                console.log('Date: ' + tweets[i].created_at);
                console.log('Tweet: ' + tweets[i].text);
                console.log('------------------------');
            }
        } else {
            console.log(error);
        } 
    });
}

// Spotify -------------------
function spotifySong(input = "The Sign Ace of Base") {
    const spotify = new Spotify(keys.spotifyKeys);

    spotify.search({ type: 'track', query: input }, function (err, data) {

        if (!err) {
            let songs = data.tracks.items;
            console.log('Artist(s): ' + songs[0].artists[0].name);
            console.log('Title: ' + songs[0].name);
            console.log('Album: ' + songs[0].album.name);
            console.log('Preview Link: ' + songs[0].preview_url);
        } else {
            console.log('Error occurred: ' + err);
            return;
        } 
    });
}

// OMDb Movies ---------------
function movieThis(input = "Mr Nobody") {
    const apikey = keys.omdbKey;

    const queryUrl = 'http://www.omdbapi.com/?apikey=' + apikey + '&t=' + input + '&y=&plot=short&r=json';

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            const jsonData = JSON.parse(body);

            console.log('Title: ' + jsonData.Title);
            console.log('Released in: ' + jsonData.Year);
            console.log('IMDB Rating: ' + jsonData.imdbRating);
            // console.log('Rotten Tomatoes Rating: ' + jsonData.Ratings[1].Value);
            console.log('Country: ' + jsonData.Country);
            console.log('Language: ' + jsonData.Language);
            console.log('Plot: ' + jsonData.Plot);
            console.log('Actors: ' + jsonData.Actors);
        }
    });
}

// Read random.txt and do-what-it-says ---------------
function doWhatItSays() {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        const randomtxt = data.split(",");

        if (randomtxt[0] === 'my-tweets') {
            showTweets();
        } else if (randomtxt[0] === 'spotify-this-song') {
            let songName = randomtxt[1];
            spotifySong(songName);
        } else if (randomtxt[0] === 'movie-this') {
            let movieName = randomtxt[1];
            movieThis(movieName);
        }
    });
}



