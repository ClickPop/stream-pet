require('dotenv').config();

module.exports = {
    tmi: {
        client: {
            identity: {
                username: process.env.BOT_USERNAME,
                password: process.env.OAUTH_TOKEN
            },
            channels: [
                process.env.CHANNEL_NAME
            ]
        }
    },
    express: {
        port: process.env.PORT || 80
    }
};
