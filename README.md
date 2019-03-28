# liri-node-app
An application meant to retrieve information on touring bands, individual songs, and movies via node in the terminal.

## Requirements to Run
In order to run this repo there are several necessary steps.

1. Clone the repo
2. NPM install the required components
3. Create a .env file to store hidden API keys
4. Acquire spotify API keys and include them in the .env file

!!Format for steps 3&4:!!

"# Spotify API keys

SPOTIFY_ID=YOUR_SPOTIFY_ID

SPOTIFY_SECRET=YOUR_SPOTIFY_SECRET"

## Video Demo
See here: https://youtu.be/FUKnn0VPN5g

## Technology
This application uses the following technologies via javascript:

-fs

-dotenv

-moment

-node-spotify-api

-inquirer

-axios

## Challenges
Prior to finding the Oject.keys() and Object.values() functions I was having a large amount of difficult figuring out how to parse the api reponses.  The Object functions made things vastly easier.