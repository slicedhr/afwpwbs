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
			.route('/home')
			//
			.get(HomeController.getAll)

			//
			.post(HomeController.create)

	}
	
