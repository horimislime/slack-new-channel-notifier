# slack-new-channel-notifier
A Slack app(bot) that notifies when new public channels are created.

## Demo
<a href="https://slack.com/oauth/authorize?scope=bot&client_id=18462741380.66724465703"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>

- Click the `Add to Slack` button above
- After you authenticate the app, a bot named `@channelnotify` will join your team.
- Invite the bot to any public channel. It will post channel name which is newly created.

<img width="292" alt="screen shot 2016-08-07 at 10 55 05 pm" src="https://cloud.githubusercontent.com/assets/264370/17484756/6a34a85c-5dc6-11e6-8939-ff973c23c2d3.png">

This demo app is run on my free Heroku dyno, so it works on limited time.

## Deploy by yourself
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

- Create your slack app and generate OAuth client ID/secret, then click deploy button and set your OAuth info.
