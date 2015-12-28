import R from 'rethinkdb'

let rdb = (opts) => { 

  opts = opts || {};
  
  opts.propName = opts.propName || 'db';

  return (req, res, next) => {

    res.on('finish', () => {

      req[opts.propName].close();

    })

    r.connect(opts, (err, conn) => {

      req[opts.propName] = conn;

      next(error);

    })

  }

}




export default rdb