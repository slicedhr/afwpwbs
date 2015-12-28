import HomeController from '../controllers/home'

// module.exports = (router) => {
    
//     router
// 		.route('/home')
// 		//
// 		.get(HomeController.getAll)

// 		//
// 		.post(HomeController.create)
// }


export default (router) => {

		router
			
			.get('/home/:id', (req, res, next) => {
				// console.log(req.query.id)
				// console.log(req.session.user.permissions)

				if (req.session.user.permissions.home && req.session.user.permissions.home.read) next()
				else 
					return res.status(401).json( { auth: false } )

			}, HomeController.get)
			
			.route('/home')
			//
			.get(HomeController.get)

			//
			.post(HomeController.create)
		

	}
	
