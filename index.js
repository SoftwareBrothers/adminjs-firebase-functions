/**
 * @module admin-bro-firebase-functions
 *
 * @description
 * Plugin that allows you to render AdminBro by Firebase Cloud Functions
 *
 * ## Installation
 * 
 * Before you start make sure you have the firebase app set up
 * (https://firebase.google.com/docs/functions/get-started):
 * 
 * ```
 * yarn global add firebase-tools
 * firebase login
 * firebase init functions
 * ```
 * 
 *
 * ```sh
 * cd functions
 * // you might need to change version of node to 10 in your package.json
 * yarn add admin-bro admin-bro-firebase-functions
 * ```
 *
 * ## Usage on emulator
 *
 * To run AdminBro locally use `buildHandler` factory method:
 * 
 * ```
 * const functions = require('firebase-functions')
 * const { buildHandler } = require('admin-bro-firebase-functions')
 *
 * // assume that you kep all you AdminBroOptions in this file
 * const adminBroOptions = require('./admin/config')
 * 
 * const onRequestHandler = buildHandler(adminBroOptions, {
 *   region: 'us-central1',
 *   before: async () => {
 *     // connect with database here (i.e.)
 *   },
 *   auth: {
 *     secret: 'super-secret-string-which-encrypts-session',
 *     authenticate: async (email, password) => {
 *        // find user and check password
 *        return foundUser
 *     }
 *   }
 * })
 * 
 * exports.app = functions.https.onRequest(onRequestHandler);
 * ```
 * 
 * And this is it - you have working AdminBro instance which can be checked by running:
 * 
 * ```bash
 * yarn serve
 * ```
 * 
 * ## Deploy script
 * 
 * AdminBro bundles custom components to `./.adminbro` folder. In other plugins
 * (admin-bro-expressjs, admin-bro-hapijs) this is done on the server side.
 * On firebase we cannot write files in project directory so we have to bundle
 * files manually before the deployment.
 * 
 * In order to do this create a simple bundle script in `./bin/bundle.js` file:
 * 
 * ```
 * // ./bin/bundle.js
 * const AdminBro = require('admin-bro');
 * 
 * // assume that you kep all your AdminBroOptions in this file
 * const adminBroOptions = require('../admin/config')
 * 
 * const admin = new AdminBro(adminBroOptions);
 * admin.initialize();
 * ```
 * 
 * and run this script before the deployment with NODE_ENV set to production.
 * 
 * To simplify it, you can update scripts in your `package.json` file like this:
 * 
 * ```json
 * {
 *   "scripts": {
 *     "bundle": "NODE_ENV=production node bin/bundle",
 *     "deploy": "yarn bundle && firebase deploy --only functions && rm .adminbro/bundle.js"
 *   }
 * }
 * ```
 * 
 * After successful deploy we remove generated bundle.
 * 
 * Now simply run:
 * 
 * ```
 * yarn deploy
 * ```
 * 
 * and in a minute you will see your app on Google Cloud Functions for Firebase
 */

module.exports = require('./lib')