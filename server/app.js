import Express from 'express';
import config from './config';
import ExpressCFG from './config/express';
import Routes from './app/routes';
import Session from 'express-session';

let app = Express();

app.use(Session({

  secret: config.secret,

  resave: true,

  saveUninitialized: true,

}));

Routes.init(app, Express.Router());

ExpressCFG.init(app, config);

app.listen(config.port, () => console.log(`Express server listening on port ${config.port}`));
