# An example web information service

This is an example application intended to be used as a starting point for the final project in [INLS 490-186 Web Information Organization](http://aeshin.org/teaching/inls-490-186/2012/sp/).

You will want to start by [forking](http://help.github.com/fork-a-repo/) this repository so you have your own copy to modify. If you decide to work in a group, I will put a copy of the code in your shared repository. (While it's possible to collaborate with your group by pushing and pulling commits across your two or three separate forks, doing so requires somewhat advanced knowledge of Git and thus isn't expected for this assignment.)

If you're working alone, please **rename your GitHub repository** to something more suitable for your service. You can do this by clicking on the ![admin](/sils-webinfo/election/raw/master/doc/img/admin.png) button from your repository's page on GitHub. A one-word, no-spaces name is best. (If you're working in a group the repository will be named after your group).

## Modifying the example service

There are only three places where the example service needs to be modified to implement your own service:

1. [`app.js`](https://github.com/sils-webinfo/election/blob/master/app.js) contains all the logic for handling HTTP requests. You may just need to modify the examples in this file, or you may need to add additional request handlers by copying, pasting, and modifying these examples. The only parts you should *need* to change are marked with with `TODO` comments. In particular, make sure you edit the value of the `USER_OR_GROUP_NAME` variable at the top of this file to match your GitHub user name (if you're working alone) or your group name:

    ```javascript
    var USER_OR_GROUP_NAME = ''; // TODO: Insert GitHub username or group name.
    ```

1. The [`views`](https://github.com/sils-webinfo/election/tree/master/views) directory contains all the EJS ([Embedded JavaScript](http://embeddedjs.com/)) templates for the service. You will need to create new templates suitable for your application, using these examples as models. The templates should include the metadata describing your application flow and data.

1. Finally, you need to edit [`package.json`](https://github.com/sils-webinfo/election/blob/master/package.json) and change the value of the `name` property to whatever you named your project.

