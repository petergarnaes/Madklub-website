# Madklub Web App

## Summary

### Utilized tech

* Webpack - all-in-one tool for bundling, transpiling using babel and hot 
reloading code
* Babel - Transpiles React classes in es6 style and es6 features in general 
to es5 (which can run in browsers)
* Node.js - Server running javascript, good for light weight thread work (ie. 
normal website work) and ideal for Universal Apps with server side rendering 
to deliver an optimal experience. Very mature environment with many tools for 
everything from internationalization, authorization to API.
* Express - Makes Node.js way more practical, by using middleware. Makes stuff 
like authorization and routing outside the App a breeze.
* React - UI component library, and thanks to babel we can write them with 
`.jsx` decorators, making it readable and more declarative.
* React Router - Easy in-app routing with built in history handling. Very
declarative, builds upon the strengths of react.
* Redux - Flux implementation, making the app even more modular and functional
* Bootstrap - Predefined CSS and components with great options for customizing
get a beautiful website. Antd (ant design) is an alternative, seems very 
similar, only a few components differ.
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
* sequelize - Construct queries in javascript, use promise chaining to easily
construct transactions depending on multiple dependent mutations.
* graphql-sequelize - Can with a given sequelize DB model help you construct
your graphql schema and resolve graphql queries into sql queries.

### Things to consider

* Database. What to use?
* All of app stylesheet is statically included in header, so the site does not 
flash unstyled. Ideally we have [critical rendering path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/)
which is possible with either [container stuff](https://github.com/kriasoft/isomorphic-style-loader)
or a more self implemented way doing stuff with css modules and load them like 
in react-redux-universal-hot-example. This should be an experimental 
afterthought, as static will be fine.
We need to define a [custom stylesheet](http://getbootstrap.com/customize/) 
that does not include style for components we do not use. For production we 
should also minify the css which `css-loader` is capable of.

## Setup Test Environment

### Requirements
Node 6.0 required, as well as a sqlite driver for test database.

### Starting the test server
To get going with the development server, first install dependencies with 
`npm install`. Then simply run `npm start`. This will start the development
server on port 3000. This setup includes hot reloading of react components, 
so styling and development should be very fast.

### Test data
To get some test data into the system, when the sequelize db is syncing change
`force` to `true` and uncomment `testDb(db)` first time you start the server.
Then you can change it back, as it will be there forever.

If you don't change it back, it will overwrite it on every restart, which makes
testing mutations hard.

### Testing environment
Changes to the server and anything in the `server` folder will trigger a 
re-bundling of the server. This is slow compared to hot-reloading, but still
great for prototyping the server.

Notice that changes to `app` folder triggers rebundling of client side bundling.
This is not the same as server side, so when refreshing you will not get a page
you just made, but when bundle arrives you will. The console will probably also
warn you your server side rendering is misbehaving, but don't worry! Just
re-bundle the server.

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
* `app`: Folder containing the app, ie. the shared code between client and
server.
* `app/routes.js`: Contain the route tree
* `app/components`: Contains a folder for each component in the app. As of now 
each folder will mostly just contain the `index.js` file, as it can all be
contained within the app. Here everything from Redux/Apollo containers to 
`mapDispatch` happens, as well as UI.
* `app/actions`: Files with methods for producing actions of different kinds.
* `app/reducers`: Reducers that can with any given action and state produce
a new state. New state should be copy, ie. reducer is pure. They are all
exported in `app/reducers/index.js`, and combined on both server and client to
form the entire state.
* `app/public`: Public assets like images, .svg's etc. Copied when building 
app.
* `app/themes`: Holds the styling (css) of the app.
* `app/async`: Holds utilities for asynchronous loading. Does not need to be
changed unless behavior of asynchronous components change.

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

## Security

Security is a key concern, and there are many pitfalls. This app goes for a
stateless authentication, as this is the simple and most flexible model for 
the user.

* HTTPS - A users interaction with the web page should be encrypted. Use lets 
encrypt (or something?) for free HTTPS? This also ensures no Man in the Middle 
attacks that can sniff up JWT token.
* passport - Allows using various strategies to verify users credentials.
This way a company with more means and experience in protecting users
information can be used.
* bcrypt - Strong password encryption with salt for local password storage.
* JWT - Authentication token tool, for safely encrypting a json object and 
using it as the authentication token. When this token is sent to the server 
we can decrypt it and retreive user ID, so successful decryption is equivalent 
to authentication of the user with the decrypted user ID. Timestamp and 
expiration is handled by library.
We only transfer this token over https ie. `secure: true`, and it is `httpOnly`
because we might as well.
* Dealing with CSRF - We use the Double Submit Cookie pattern, which together 
with same-origin policy (default) ensures that it requires JavaScript to make 
a valid request, which by same-origin is only possible in the page we served, 
and not some malicious third-party site, or any sort of link the user is 
tricked into clicking.
* Dealing with XSS - All string inputs must be sanitized! Even though session 
JWT token is `httpOnly` XSS could still use logged in session, and traverse 
any CSRF method. While they can not get the JWT token, they can still send 
request from the browser as the logged in user.

More notes on public API in Random Notes.

All mutations should be verified if the user is allowed to do the mutation in 
question. Does the user have the right permissions? Is time restrictions and 
deadlines held? All mutations with several steps should be transactions. 
Writes should be infrequent, so transactions will do.

ALL INPUT MUST BE SANITIZED!

## Structure and architecture

This is an isomorphic app, with _all_ styling pre-bundled, and delivered on any
page load. The philosophy is that we stick mainly to bootstrap, with only a few
extensions which does not increase bundle size that much.

Bootstrap is fairly well optimized for the modern browser, so pulling the whole
thing is not to bad (ca. 118 kb). This also seem to be the standard, as there
are not a lot of work done on isomorphic style loading (only one repo as far as
I can see).

### Async components

To keep the bundle size of the app to a minimum, we use code splitting to make
all non-immediate components split from the `main` bundle. These can then be
downloaded on demand. It all hinges on the `import()` statement.

At compile time, webpack takes any `import()` statement, dereference its path
and bundles that code __with__ dependencies into a separate bundle. When that
same `import()` statement is reached at run-time, it returns a promise that
returns the module we split of.

A problem arises though... These components should _only_ be asynchronous on
the client. To solve this problem, we do make a module that uses `require`
instead of `import()` because it is synchronous, and with
`NaromalModuleReplacementPlugin` make the server use the synchronous module
when bundled up.

This however creates yet _another_ problem. Even though the client gets the
page server-side rendered, when running the bundle code, it thinks it has to
load the component asynchronously. Because asynchronous components don't show
while loading, this happens:

* Client gets server-side rendered page in all its glory!
* Bundle starts loading the required component with all the code necessary to
run it, but while it waits, shows nothing, ie. __removes__ the glorious
sever-side rendered content.
* Component is asynchronously loaded, mounts the component and everything is
good again.

So as we can see, our efforts are ruined. We want the server to tell the client
which async components are already rendered, and make the client wait for those
components to load before rendering the app.

This is communicated through Redux. When server renders an async component, it
fires a `register` event, which makes the store remember the key for the
component it rendered. Before the client renders, it waits for all the async
components indexed by the keys the server sends. These components are stored in
a map, again indexed by their keys. This is so when the async route is rendered
and it discovers that the server has already rendered it, it uses the component
from the "loaded components" map instead of loading it itself through
`import()`.

This works, and has some added benefits!

* Hot Module Reloading can still be achieved if the client synchronously loads
components instead of asynchronously. This is a simple matter of bundling the
client with the same `NaromalModuleReplacementPlugin` trick as with the server.
* We can prevent waterfall downloading, by taking the registered routes after
the app rendered on the server side, and use those keys to add `<preload />`
statements to the header on the server side.

The downside is that it introduces overhead, and is not very declarative.
Two files must be created for each route we want to load asynchronously, and
the key must be correct in a few places for it to work. The overhead is not
to bad, as no tree walking occurs (which other solutions implement). The gains
we achieve also greatly outweigh the overhead. With small app components, the
code for any page of the app will download very fast, and even faster with the
`<preload />` trick. These components are also cacheable, so revisits are fast.
The overhead in constructing the `<preload />` serverside is small.

## TODOs

* Relative paths in `server/index.js` should not have `dist/` in front, the
`dist` folder should be self contained. This is important for making the
production bundle work.
* [Pre-process GraphQL ASTs](http://dev.apollodata.com/react/webpack.html) for
Apollo with webpack when bundling. This should decrease bundle size, as
`graphql-tag` is no longer required client side, and speed up client side
because client does not need to do AST processing.
* [Compress client side bundle](https://github.com/webpack-contrib/compression-webpack-plugin).
Should make our bundle well below 200kb, which is somewhat better. Make server
send a
```
if(process.env.NODE_ENV === 'production'){
    app.get('*.js', function (req, res, next) {
        req.url = req.url + '.gz';
        res.set('Content-Encoding', 'gzip');
        next();
    });
}
```

* Switch to [preact](https://github.com/developit/preact) to decrease bundle
size. `preact-compat` should give us very little change. Maybe `preact-compat`
for production?
* Optional polyfills/fetch/Promise/assign/keys bundle for old browsers, so we
don't need to include it in main bundle. [Link](https://gist.github.com/davidgilbertson/6a66e05d6f193281a4c6b54d19acf3fd#file-optional-polyfill-js).
* Look into service workers. Just [this](https://hackernoon.com/10-things-i-learned-making-the-fastest-site-in-the-world-18a0e1cdf4a7#.54l8nvqy8)
article in general. Maybe because of `async`/`await` we can't just take it out?
* Can we change fonts to native ones? So we don't need external ones?
* Make the `import()` statements use our custom splits created by the
`CommonChunksPlugin`, so they don't bundle and load the parts of the vendor
library they use.
* Preload/prefetch bundle
* Implement preload of bundle(s) we send. Remember chunk hashes for production
* Split CSS into modules that can load asynchronously. Take the non-minified
CSS theme we have, and split it. Load it with links separately, with the most
important modules linked first. Most important module would be body and navbar
stuff, rest loads in along the way. All this should be very cacheable.
* Consider using `nprogress` for things?


## Random Notes

### Requirements

Target browser must be newer browser that supports HTML5, because of its
browser history API. It is possible to instruct our router to do full refresh
on every navigation, which we would do for non-HTML5. This can get complicated
fast though, so for now just don't support.

# Public API security

If we wanted our GraphQL API to be public, we could give out an API key, which 
is just another JWT token but with a different secret/header. Our API should 
then be able to verifiy either cookie+csrf or HTTP header with 
`Authorization: Bearer jwt-api-key` which is the standard OAuth pattern. A 
separate login page might be in order here.

### Async loading

With new version of react-router, it is simply a matter of asynchronously
loading components, which there are many guides on.

#### react-router < v4
To add asynchronously loaded libraries and components see [medium blog post](https://medium.com/@lavrton/progressive-loading-for-modern-web-applications-via-code-splitting-fb43999735c6#.yvw7jdab4)
or [code splitting](https://webpack.js.org/guides/code-splitting-require/).

For asynchronously loaded routes see react router [dynamic routing](https://github.com/ReactTraining/react-router/blob/master/docs/guides/DynamicRouting.md)


