import Express from 'express' // Minimalist web framework for node
import Glob from 'glob' //Match files using the patterns the shell uses, like stars and stuff.
import Favicon from 'serve-favicon' // Middleware for serving favicon
import Logger from 'morgan' //HTTP request logger Middleware
import CookieParser from 'cookie-parser'
import BodyParser from 'body-parser'
import Compress from 'compression' //compression middleware
import MethodOverride from 'method-override' //Override HTTP verbs
import Path from 'path'

export default class ExpressConfig {

  static init(app, config){

  let env = process.env.NODE_ENV || 'development';
  
  let controllers = Glob.sync(config.root + '/app/controllers/*.js');

  app.locals.ENV = env;

  app.locals.ENV_DEVELOPMENT = env === 'development';
  
  app.set('views', `${config.root}/app/views`);
  
  app.set('view engine', 'jade');

  // app.use(Favicon(config.root + '/public/img/favicon.ico'));

  app.use(Logger('dev'));

  app.use(BodyParser.json());

  app.use(BodyParser.urlencoded({

    extended: true

  }));

  app.use(CookieParser());

  app.use(Compress());

  app.use(Express.static(`${config.root}/public`));

  app.use(MethodOverride());


  // for (let i = controllers.length - 1; i >= 0; i--)
  //   require(controllers[i])(app);
    

  app.use((req, res, next) => {
 
    let err = new Error('Not Found');

    // err.status = 404;

    res.render(Path.join(Path.dirname(require.main.filename), '/app/views'))

    // next(err);

  });
  
  if(app.get('env') === 'development'){

    app.use((err, req, res, next) => {

      res.status(err.status || 500);

      res.render('error', {

        message: err.message,

        error: err,

        title: 'error'

      });

    });

  }

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });


  };
}