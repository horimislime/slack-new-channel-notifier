var botkit = require('botkit');
var redis = require('redis');
var url = require('url');

var redisURL = url.parse(process.env.REDISCLOUD_URL);
var storage = redis.createClient({
    host: redisURL.hostname,
    port: redisURL.port,
    auth_pass: redisURL.auth.split(':')[1]
});

var controller = botkit.slackbot({
    debug: false
}).configureSlackApp({
    clientId: process.env.SLACKAPP_CLIENT_ID,
    clientSecret: process.env.SLACKAPP_CLIENT_SECRET,
    scopes: ['bot']
});

var tokens = ['bot-tokens'];
storage.lrange('bot-tokens', 0, -1, function(error, reply) {

    if (error || !reply) {
        console.log('Error: ' + error);
        return;
    }

    reply.forEach(function (token) {
        controller.spawn({token: token}).startRTM();
    });
});

controller.setupWebserver(process.env.PORT || 5000, function(error, webserver) {
    
    controller.createWebhookEndpoints(controller.webserver);
    
    controller.createOauthEndpoints(controller.webserver, function(error, request, response) {
        if (error) {
            response.status(500).send('Error: ' + JSON.stringify(error));
        } else {
            response.send('Success! See you on your Slack team.');
        }
    });

    // Accept GET request to wake dyno up
    webserver.get('/', function(request, response) {
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end('Ok, dyno is awake.');
    });
});

controller.on('create_bot', function(bot, config) {
    
    if (tokens.indexOf(bot.config.token) >= 0) {
        console.log('The bot is already online.');
        return;
    }

    bot.startRTM(function(error) {

        if (!error) {
            tokens.push(bot.config.token);
            storage.rpush(tokens, redis.print);
        }

        bot.startPrivateConversation({user: config.createdBy}, function(err, convo) {
            convo.say('I am channel notify bot that has just joined your team');
            convo.say('Please /invite me to a channel so that I can tell you when new public channels are created!');
        });
    });
});

controller.on('channel_created', function(bot, message) {
    
    bot.api.channels.list({}, function (error, response) {
        
        if (!response.hasOwnProperty('channels') || !response.ok || error) {
            return;
        }

        // Post message to channels bot user joined
        response.channels.forEach(function (channel) {
            if (channel.members.indexOf(bot.identity.id) >= 0) {
                var payload = {
                    text: 'New public channel 👉 #' + message.channel.name,
                    link_names: 1,
                    parse: 'full',
                    attachments: []
                };
                bot.reply({'channel': channel.id}, payload);
            }
        });
    });
});
