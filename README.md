#Spotify Mixers

##Description
Spotify Mixers is a web app that lets Spotify users automate the process of mixing their playlists.  Whether you want to create a gaming playlists with your friends or combine two playlists you think would work well together, Spotify Mixers makes that process quick and easy.

##Quick Start
DISCLAIMER:This app is still under construction and has yet to be hosted online, thus to run this app atm you will need a spotify and MongoDB account
###Setting up the Spotify Project
1) Go to [Spotify's developer page]{https://developer.spotify.com/} and create a project with and set your redirect uri to the localhost instance you will use to run the front end of the app.
2) Edit the const variables in the "./frontend/spotify-project/src/spotify_functions.tsx" file with the appropriate local host values, port number you will run the backend on, and the public client key from your spotify project.
3) Create a mongodb server based on [this video]{https://youtu.be/bxsemcrY4gQ?si=O9xxaIfOh04bzX9g}
4) In the backend folder create a .env file with
    - PORT= the port number your want to use for the backend
    - SPOTIFY_ID=  the spotify project client id
    - SPOTIFY_SECRET= the spotify project secret id (make sure you do not upload this)
    - MONGODB_CONNECTION_STRING= the connection string for your mongodb instance 
###Backend
Open a terminal window and run
    - 'npm i' to instal dependencies
    - 'npm run dev' to run the development server
###Frontend
Same process as backend