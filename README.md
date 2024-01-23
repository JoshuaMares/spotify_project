# Spotify Mixers

## Description
Spotify Mixers is a web app that lets Spotify users automate the process of mixing their playlists.  Whether you want to create a gaming playlists with your friends or combine two playlists you think would work well together, Spotify Mixers makes that process quick and easy.

## Quick Start
DISCLAIMER:This app is still under construction and has yet to be hosted online, thus to run this app atm you will need a spotify and MongoDB account

### Setting up the Spotify Project
1) Go to [Spotify's developer page]{https://developer.spotify.com/} and create a project with and set your redirect uri to the localhost instance you will use to run the front end of the app.
2) Create a mongodb server based on [this video]{https://youtu.be/bxsemcrY4gQ?si=O9xxaIfOh04bzX9g}
3) Edit the const variables in the "./frontend/spotify-project/src/spotify_functions.tsx" file with the appropriate local host values, port number you will run the backend on, and the public client key from your spotify project.
4) In the backend folder create a .env file with
    - PORT= the port number your want to use for the backend
    - SECRET= a random string used to sign the json web tokens
    - SPOTIFY_ID=  the spotify project client id
    - SPOTIFY_SECRET= the spotify project secret id (make sure you do not upload this)
    - MONGODB_CONNECTION_STRING= the connection string for your mongodb instance 

### Backend
1) First clone the repo to your local machine
    - ''' git clone https://github.com/doublelariat180/spotify_project.git '''
2) Create two tabs, one for backend, and one for frontend
3) Move into the backend folder
    - ''' cd spotify_project/backend/ '''
4) Create a .env file using the specifications listed above
5) Install the required dependencies
    - ''' npm install '''
6) Run the dev environment
    - ''' npm run dev '''
7) You should now have a nodemon instance that your frontend can connect to. Feel free to make any changes as nodemon will automatically restart the server when it detects changes

### Frontend
1) Open the second tab made ealier for our front end
2) Move into the react project folder
    - ''' cd spotify_project/frontend/spotify-project '''
3) Install the required dependencies
    - ''' npm install '''
4) Run the dev environment
    - ''' npm run dev '''
5) Vite will create a server to run the react project in.  Open the created link in a browser to use the app