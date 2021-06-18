A plugin that allows you to render AdminJS by Firebase Cloud Functions

## Installation

Before you start make sure you have the firebase app set up
(https://firebase.google.com/docs/functions/get-started):

```sh
yarn global add firebase-tools
firebase login
firebase init functions
```


```sh
cd functions
// you might need to change version of node to 10 in your package.json
yarn add adminjs @adminjs/firebase-functions
```

## Usage on emulator

To run AdminJS locally use `buildHandler` factory method:

```javascript
const functions = require('firebase-functions')
const { buildHandler } = require('@adminjs/firebase-functions')

// assume that you kep all you AdminJSOptions in this file
const adminJsOptions = require('./admin/config')

const onRequestHandler = buildHandler(adminJsOptions, {
  region: 'us-central1',
  before: async () => {
    // connect with database here (i.e.)
    // if this function returns something - it will replace
    // adminJsOptions passed as first argument to buildHandler
  },
  auth: {
    secret: 'super-secret-string-which-encrypts-session',
    authenticate: async (email, password) => {
       // find user and check password
       return foundUser
    }
  }
})

exports.app = functions.https.onRequest(onRequestHandler);
```

And this is it - you have the working AdminJS instance which can be checked by running:

```bash
yarn serve
```

## Deploy script

AdminJS bundles custom components to `./.adminjs` folder. In other plugins
(@adminjs/express, @adminjs/hapi) this is done on the server-side.
On firebase we cannot write files in the project directory so we have to bundle
files manually before the deployment.

In order to do this create a simple bundle script in `./bin/bundle.js` file:

```javascript
// ./bin/bundle.js
const AdminJS = require('adminjs');

// assume that you keep all your AdminJSOptions in this file
const adminJsOptions = require('../admin/config')

const admin = new AdminJS(adminJsOptions);
admin.initialize();
```

and run this script before the deployment with NODE_ENV set to production.

To simplify it, you can update scripts in your `package.json` file like this:

```json
{
  "scripts": {
    "bundle": "NODE_ENV=production node bin/bundle",
    "deploy": "yarn bundle && firebase deploy --only functions && rm .adminjs/bundle.js"
  }
}
```

After a successful deployment, we can remove the generated bundle.

Now simply run:

```
yarn deploy
```

and in a minute you will see your app on Google Cloud Functions for Firebase

## Do this even better.

AdminJS serves 4 major assets:

- global.bundle.js which contains react, redux, axios etc.
- design-system.bundle.js with AdminJS Design System
- app.bundle.js where the entire AdminJS frontend application resides
- components.bundle.js - this is the place for bundled (with {@link AdminJS.bundle})
custom components (admin.initialize(); creates it in `./adminjs/bundle.js`)

And 2 less important: `logo` and `favicon` which can be changed in the {@link AdminJSOptions}.

So it means that your function will have to serve these all assets every time the user
opens the page with a web browser - meaning more function calls and cold start problems.

You can change that by setting {@link AdminJSOptions.assetsCDN} to bypass serving assets right
from AdminJS. 

Before the deployment you can copy those files to the /public directory and host this directory
via firebase hosting. Next point {@link AdminJSOptions.assetsCDN} to the hosting URL and you will
save these extra calls to your function.

First, you will need to add [firebase hosting]{@link https://firebase.google.com/docs/hosting}
to your app and set it up to host files from ./public directory.

Next, we have to update ./bin/bundle.js to copy assets to the `/public` folder:

```javascript
const AdminJS = require('adminjs');

// assume that you keep all your AdminJSOptions in this file
const adminJsOptions = require('../admin/config')

const admin = new AdminJS(adminJsOptions);
fs.copyFile(
  './node_modules/adminjs/lib/frontend/assets/scripts/app-bundle.production.js',
  './public/app.bundle.js',
);
fs.copyFile(
  './node_modules/adminjs/lib/frontend/assets/scripts/global-bundle.production.js',
  './public/global.bundle.js',
);
fs.copyFile(
  './node_modules/@adminjs/design-system/bundle.production.js',
  './public/design-system.bundle.js',
);

// this is optional - or simply change default logo
fs.copyFile(
  './node_modules/adminjs/lib/frontend/assets/images/logo.svg',
  './public/logo.svg',
)
admin.initialize().then(() => {
  fs.rename('./.adminjs/bundle.js', './public/components.bundle.js');
})
```

> This script doesn't create a folder so you have to `mkdir` it manually.

Finally updated deploy script:

```sh
"deploy": "yarn bundle && firebase deploy --only functions,hosting"
```

Also, you will have to update your `firebase.json` with information about the hosting page.

## Custom domain

So let's assume that you have a `rootUrl` set to `/` in AdminJS. Your function target name,
(how you name your export) is `app`.

So the root of the page will be: `YOUR-FUNCTION-HOST/app/`.

Depending on the environment, (emulator or an actual firebase domain) `@adminjs/firebase-functions`
will properly adjust the path, that AdminJS knows where to redirect users
(not to `/` but to `/app`).

In such a case, you don't need to do anything,

But now you are adding a reverse prox, which redirects traffic from `your-domain.com/app` to
`YOUR-FUNCTION-HOST/app`.

And now admin does not know how to build the URL because he thinks that, requests are not namespaces
(not from the firebase domain).

So we have to tell AdminJS that, to the `rootUrl` he has to prepend the `customFunctionPath`.

CustomPropertyPath should be `app` because `path` going from firebase to admin will be `app/` but
admin is waiting for `/` (rootUrl).


`customPropertyPath` is a member of {@link BuildHandlerOptions}