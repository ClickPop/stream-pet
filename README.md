# stream-pet
Twitch Stream Pet

## Running the server
> Please refrain from using `yarn` to keep the Git repo a little cleaner. Sorry about my previous transgressions in this regard!

1. From within the root directory run
`npm install` to install necessary dependencies.
2. Create a file called `.env` in server directory.
3. Copy contents of `.env.sample` to `.env` and fill in appropriate variables.
4. To start the server: `npm start`

#Running the client

1. Open `http://127.0.0.1:<PORT>` in a browser.
2. To view the current animation state: `/api/v1/creature/state/`.

## Editing the template (for the time being)

1. Templates use PUG templating engine
2. They located in the `views` path.
