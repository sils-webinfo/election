# An example web information service

This is an example application intended to be used as a starting point for the final project in [INLS 490-186 Web Information Organization](http://aeshin.org/teaching/inls-490-186/2013/sp/).

## Forking this repository

You will want to start by [forking](http://help.github.com/fork-a-repo/) this repository so you have your own copy to modify. If you decide to work in a group, I will put a copy of the code in your shared repository. (While it's possible to collaborate with your group by pushing and pulling commits across your two or three separate forks, doing so requires somewhat advanced knowledge of Git and thus isn't expected for this assignment.)

If you're working alone, please **rename your GitHub repository** to something more suitable for your service. You can do this by clicking on the `Settings` button in the top right of your repository's page on GitHub. A one-word, no-spaces name is best. (If you're working in a group the repository will be named after your group).

## Cloning your project in Cloud9

If you're working alone, and you've successfully forked the repository to your own GitHub account, then cloning your project into Cloud9 is simple. Just sign in to [Cloud9](http://c9.io) using your GitHub account (click the little green [Octocat](http://octodex.github.com/) icon). Your dashboard should open, and you will see a list of `PROJECTS ON GITHUB` on the left. Select your project and click the green `CLONE TO EDIT` button.

If you're in a group, your GitHub repository won't show up in the list of GitHub projects, so you need to click the plus-sign button next to `MY PROJECTS` on the left, and select `Clone From URL`. Then (in another browser tab) go to the homepage of your team's repository, and copy the URL next to where it says `Read+Write access` (it should look something like `git@github.com:sils-webinfo/SteampunkUnicorn.git` if `SteampunkUnicorn` were the name of your group). Go back to Cloud9, paste this URL in the `Source URL` field, and click the green `CHECKOUT` button. Cloud9 should start cloning your project. (Sometimes it flakes out; if it does just try again.)

## Modifying the example code

There are only three places where the example service needs to be modified to implement your own service:

1. [`app.js`](https://github.com/sils-webinfo/election/blob/master/app.js) contains all the logic for handling HTTP requests. You may just need to modify the examples in this file, or you may need to add additional request handlers by copying, pasting, and modifying these examples. The only parts you should *need* to change are marked with with `TODO` comments. In particular, make sure you edit the value of the `USER_OR_GROUP_NAME` variable at the top of this file to match your GitHub user name (if you're working alone) or your group name:

    ```javascript
    var USER_OR_GROUP_NAME = ''; // TODO: Insert GitHub username or group name.
    ```

1. The [`views`](https://github.com/sils-webinfo/election/tree/master/views) directory contains all the EJS ([Embedded JavaScript](http://embeddedjs.com/)) templates for the service. You will need to create new templates suitable for your application, using these examples as models. The templates should include the metadata describing your application flow and data.

1. Finally, you need to edit [`package.json`](https://github.com/sils-webinfo/election/blob/master/package.json) and change the value of the `name` property to whatever you named your project.

## Testing your code

To run your project, simply open `app.js` and click the `Run` button at the top of the screen (it looks like a green play button). You should see a message like this in the console:

```
Running Node Process
Your code is running at 'http://election.rybesh.c9.io'.
Important: use 'process.env.PORT' as the port and 'process.env.IP' as the host in your scripts!
```

Clicking on the URL (in my case, `http://election.rybesh.c9.io` since `rybesh` is my GitHub/Cloud9 username) should open a new browser tab or window to your web app.

If you get an error message, it's probably because you forgot to set `USER_OR_GROUP_NAME` (see above) or due to a syntax error somewhere in `app.js` (look for red `X`s along the left margin of the editor when you open `app.js`). 

## Troubleshooting

Running your app in Cloud9 and looking at the console output should help you troubleshoot basic problems. You can add logging messages to `app.js` like this:

```javascript
console.log("Calculating grobble vectors…");
```

Then you when you run your app in Cloud9, you should see the text `Calculating grobble vectors…` in your console when that code is executed. Adding lots of console logging messages like this can help you understand when various parts of the program are running. You can also print out variables to see what their values are:

```javascript
// Get the item ID from the URI.
var item_id = req.params.id;
console.log("the item id is: ", item_id);
```

You may also want to verify that data is being created and updated in your database correctly. You can do this by going to [the admin tools for our shared database server](http://sils-webinfo.iriscouch.com/_utils/). Find your database in the list (it is named whatever you set `USER_OR_GROUP_NAME` to in `app.js`), and click it. You should see a list of all the "documents" (objects) in your database. Clicking on a document ID will show its details (properties and values).

## Deploying to Heroku

When you've got your app running how you want it, and you're ready to turn things in, it's time to deploy to [Heroku](http://www.heroku.com/). Heroku is a free (for us) cloud hosting platform. It will enable your app to run longer than it can in the Cloud9 debugger.

First, [sign up](https://api.heroku.com/signup) for Heroku. Then, follow [these instructions](https://docs.c9.io/deploying_to_heroku.html) to deploy your app. Don't worry about the `package.json` and `Procfile` files: those already exist, and you shouldn't have to change them except to change the project name in `package.json` (see above).

