import UserController from '../controllers/user'
import { Permissions } from '../services/permissions'

export default router => {

		router
			
			.get('/user/:id', (req, res, next) => {

				const REQUIRED = ['user.read']

				console.log(req.user)

				Permissions(req.user.permissions, REQUIRED)

					.then(next)
					
					.catch(err => res.status(401).send(err))

			}, UserController.get)


			
			.route('/user')
			
			.get( (req, res, next) => {

				const REQUIRED = ['user.read']

				Permissions(req.user.permissions, REQUIRED)

					.then(next)

					.catch(err => res.status(401).send(err))
					
			}, UserController.get)


			.post( (req, res, next) => {

				const REQUIRED = ['user.create']

				Permissions(req.user.permissions, REQUIRED)

					.then(next)

					.catch(err => res.status(401).send(err))
					
			}, UserController.create)
		

	}
	
