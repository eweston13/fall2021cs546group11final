const express = require('express');
const session = require('express-session');
const app = express();
const static = express.static(__dirname + '/public');
const cookieParser = require('cookie-parser'); 
const configRoutes = require('./routes');
app.use(cookieParser());

const {engine} = require('express-handlebars');

/*
	commented this out because it wasn't working -erin

const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
      asJSON: (obj, spacing) => {
        if (typeof spacing === 'number')
          return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));
  
        return new Handlebars.SafeString(JSON.stringify(obj));
      }
    }
  });
*/

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
};

app.use;
app.use('/public', static);
app.use(express.json());

app.use(
  session({
    name: 'AuthCookie',
    secret: "test",
    resave: false,
    saveUninitialized: true
  })
);

app.use('/', (req, res, next) =>{
  // console.log(Object.keys(req))

  if(req.session.username){
    console.log("[",new Date().toUTCString(), "]: ", req.method, req.originalUrl, " (Authenticated User)")
  }else{
    console.log("[",new Date().toUTCString(), "]: ", req.method, req.originalUrl, " (Non-Authenticated User)")
  }

  if(req.url == '/' && req.session.username ){
    return res.redirect('/private')
  }else{
    next()
  }
  }
);

app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', engine({extname: '.handlebars', defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});


