# stream-pet
Twitch Stream Pet

## Running the server

1. From within the server (`./server`) directory run
`npm install` or `yarn install` to install necessary dependencies.
2. Create a file called `.env` in server directory.
3. Copy contents of `.env.sample` to `.env` and fill in appropriate variables.
4. To start the server: `npm start` or `yarn start`

#Running the client

1. Open `./client/index.html` in a browser.
2. Once it connects, !commands typed in to Twitch Chat will appear.

## Editing the template (for the time being)

1. Install [Sass](https://sass-lang.com/install).
2. From your client (`./client`) directory run `sass --watch scss:css` - Any changes you make to the scss files will compile as css.
