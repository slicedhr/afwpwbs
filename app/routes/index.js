import Path from 'path'
import Glob from 'glob'
import BodyParser from 'body-parser'
import jwt from "jsonwebtoken";
import Config from '../../config'


const appDir = Path.dirname(require.main.filename)

String.prototype.contains = function(it) { 

  return this.indexOf(it) != -1; 

};

export default class Routes {
  
  static init(app, router){

    //JWT Middleware
    router.use((req, res, next) =>{

      let token = req.body.token || req.query.token || req.headers['x-access-token'];

      if (token) {

        jwt.verify(token, Config.secret, (err, decoded) => {

          if (err) 
            return res.json({ auth: false, message: 'Failed to authenticate token.' });

          else {

            req.decoded = decoded; 

            next();
          }

        });

      } else 
        return res.status(403).send({ 
            auth: false, 
            message: 'No token.' 
        });
    })
  	
    //Read routes folder
  	let files = Glob.sync(Path.join(appDir,'/app/routes/!(index)*.js'))

  	files.forEach( file => {

  		require(file)['default'](router)

  	})

  	app.use(BodyParser.json());

  	app.use(BodyParser.urlencoded({

  	    extended: true

  	}));



    //Custom routes

    app.post('/authenticate', require('../controllers/authenticate'))

    //Routes

    app.use('/api/v1', router);




  }

}