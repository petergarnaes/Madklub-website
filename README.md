# Madklub Web App

## Summary

### Utlizied tech

* Webpack - all-in-one tool for bundling, transpiling using babel and hot 
reloading code
* Babel - Transpiles React classes in es6 style and es6 features in general 
to es5 (which can run in browsers)
* Node.js - Server running javascript, good for light weight thread work (ie. 
normal website work) and ideal for Universal Apps with server side rendering 
to deliver an optimal experience. Very mature environment with many tools for 
everything from internasonalization, authorization to API.
* Express - Makes Node.js way more practical, by using middleware. Makes stuff 
like authorization and routing outside the App a breeze.
* React - UI component library, and thanks to babel we can write them with 
`.jsx` decorators, making it readable and more declarative.
* React Router - Easy in-app routing with built in history handling and much 
more.
* Redux - Flux implementation, making the app even more modular and functional
* Boostrap - Predefined CSS and components with great options for customizing 
get a beautiful website.
* GraphQL - An API supporting queries, so changes in frontend data dependencies
does not require changes in backend API. Also ensures we never overfetch, or 
make multiple API calls for one page.
* Apollo - Easy way to declare data dependencies for individual react 
components, and constructs the GraphQL query for you when loading the 
components, as well as call the GraphQL API to provide the data. Also plays 
nice with Redux.
* JWT - Smart way to deal with tokens and login sessions for the app.
* Passport - Authorization middleware, with possible Facebook integration!
* bcrypt or scrypt - Encryption and salting tool for storing passwords.

### Things to consider

* Database. What to use?

## Setup Test Environemnt

To get going with the development server, first install dependencies with 
`npm install`. Then simply run `npm start`. This will start the development
server on port 3000. This setup includes hot reloading of react components, 
so styling and development should be very fast.

As of now, changes to the server or the files it touches are not triggering a 
re-bundling and restarting of the server. Perhaps with `nodemon` or built in 
`compiler.watch()` in `server.js`?

## Project structure

Mostly clear... This is so far:

* `server`: Contains all server specific code. Contains GraphQL specific code,
passport schemes and database configs. To level shema is in `schema.js`
* `server/api`: Contains GraphQL specific code, as well as database 
configuration.
* `server/api/db`: Database configuration, uses `sequelize` to set up and call 
an SQL database. `index.js` exports the sequelize shema of the entire DB, to 
easily construct the GraphQL shema and resolve with `graphql-sequelize`.
* `server/api/types`: Contains our defined types, which is the meat of our 
schema.
* `server/api/queries`: Top level types in our schema, to simplify `schema.js`
greatly. Also contains queries that are not representations of the database, 
like current user session info, potentially user settings or server info.
* `server/api/mutations`: Contains all mutations possible in our schema.
* `client`: Contains client specific code. As of now it simply contains the 
browser specific setup for rendering the app. Browser specific is setting up 
history with the router, getting initial store state from HTML header sent from
server into Redux, setting up Apollo and such.
* `app/routes.js`: Contain the route tree
* `app/components`: Contains a folder for each component in the app. As of now 
each folder will mostly just contain the `index.js` file, as it can all be 
contained within the app. Here everything from Redux/Apollo containers to 
`mapDispatch` happens, as well as UI.
* `app/public`: Public assets like images, .svg's etc. Copied when building 
app.

## Building App

When running `npm run build` as of now, the app will be built in the `dist` 
folder. The idea is that the files there is the complete app. As of now, the 
client side Javascript app is built to `bundle.js` and `bundle.js.map`. The map
is for debugging, because `devtool: 'source-map'` is defined, maybe remove for
build/production?

Server is also transpiled and bundled with webpack. For production build, 
uglifying and no hot reload can be used exactly like with client, but with 
`target: node` of course, as we see in `webpack.config.server.dev.js`.

Point is, that `dist` folder should contain the finished app that is minified 
and transpiled to es5. This means both client and server code in a bundled, 
transpiled and minified state. The client `bundle.js` should be available for 
the HTML document to load, so in the future it should probably be in something 
like `dist/public`, along with other assets.

## Random Notes

### Async loading

To add asynchronously loaded libraries and components see [medium blog post](https://medium.com/@lavrton/progressive-loading-for-modern-web-applications-via-code-splitting-fb43999735c6#.yvw7jdab4)



