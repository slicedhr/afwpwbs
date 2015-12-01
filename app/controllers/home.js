import R from 'rethinkdb'

export default class HomeController{

  static getAll(req, res){

    // R.connect({db: 'activos_fijos_main', host:'192.168.0.11'}).then(conn => {
    //   R.table('test').insert(require('./MOCK_DATA.json')).run(conn).then(fields=>{
    //   console.log(fields)
    // })
    // })


      res.send('Get All')
  }

  static create(req, res){

    console.log(req.session)

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