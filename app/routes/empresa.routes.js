import EmpresaController from '../controllers/empresa'
import { Permissions } from '../services/permissions'

// module.exports = router => {

// 	router
// 		.route('/empresa')
// 		.get(EmpresaController.get) 
// 		.post(EmpresaController.create)

// }

export default (router) => {

    	router
    		
    		.route('/empresa/:id')

	    		.get( (req, res, next) => { // Get by ID

					const REQUIRED = ['empresa.read','admin']

					Permissions(req.user.permissions, REQUIRED)

						.then(next)
						
						.catch(res.status(401).send)

				}, EmpresaController.get)

				.put( (req, res, next) => { // Update

					const REQUIRED = ['empresa.update','admin']

					Permissions(req.user.permissions, REQUIRED)

						.then(next)
						
						.catch(res.status(401).send)

				}, EmpresaController.update)

				.delete( (req, res, next) => { // Delete

					const REQUIRED = ['empresa.delete','admin']

					Permissions(req.user.permissions, REQUIRED)

						.then(next)
						
						.catch(res.status(401).send)

				}, EmpresaController.delete)

		router
    		
			.route('/empresa')

				.get((req, res, next) => { // Get 

					const REQUIRED = ['empresa.read','admin']

					Permissions(req.user.permissions, REQUIRED)

						.then(next)
						
						.catch(res.status(401).send)

				}, EmpresaController.get) 
				
				.post((req, res, next) => { // Create

					const REQUIRED = ['empresa.create','admin']

					Permissions(req.user.permissions, REQUIRED)

						.then(next)
						
						.catch(res.status(401).send)

				}, EmpresaController.create)
}
