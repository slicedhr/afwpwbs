import jwt from "jsonwebtoken";
import R from 'rethinkdb'
import Path from 'path'
import Config from '../../config'
import UserController from '../controllers/user'
// import HanddleError from '../services/handdleErrors'


module.exports = (req, res) => {
	
	UserController
		.getUser(false, false, req.body)
		.then(user => {

			if (user.length){

				req.session.user = user[0]

				return res.status(200).json({
					token: jwt.sign(user[0].id, Config.secret, { expiresIn: '1m' }),
					user: user[0],
					auth: true
				})

			}

			else
				return res.status(401).send({
					auth: false
				})
			
		})
		.error(err => res.send(err))
}