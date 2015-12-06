import R from 'rethinkdb'

import Config from '../../config'


export default class HomeController{

  static getUser(id){
    
    return getUser(id)
  }

  static get(req, res){

    let id = req.query.id || req.params.id || undefined;

    getUser(id)
      .then(data => res.send(data))
  }

  static create(req, res){


    res.send('Created')
  }

  static delete(req, res){

    console.log(req.body)

    res.send('deleted')
  }

}

// router.get('/hi', (req,res,next) => {

//   R.connect({db: 'activos_fijos_main', host:'192.168.0.17', port: '28015'})
//     .then( conn => {

//       return R.table('test').changes().run(conn)

//     })
//     .then( cursor => {
//       cursor.each((err, item) => {
//         console.log(item)
//       })
//     })

//     res.send('hi! there!')
// })

// module.exports = app => {

//   app.use('/', router);

// };

// let _id = req.params.id;

//     TodoDAO
//       .deleteTodo(_id)
//       .then(() => res.status(200).end())
//       .catch(error => res.status(400).json(error));