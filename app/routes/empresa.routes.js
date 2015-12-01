import EmpresaController from '../controllers/empresa'

// module.exports = router => {

// 	router
// 		.route('/empresa')
// 		.get(EmpresaController.get) 
// 		.post(EmpresaController.create)

// }

export default (router) => {

    	router
			.route('/empresa')

			.get(EmpresaController.get) 
			
			.post(EmpresaController.create)
  }
