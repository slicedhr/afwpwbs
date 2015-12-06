import jwt from "jsonwebtoken";
import R from 'rethinkdb'
import Path from 'path'
import Config from '../../config'
// import HanddleError from '../services/handdleErrors'


module.exports = (req, res) => {

	R.connect(Config.db)
	.then(conn => {

		R.table('user')
			.filter( { email: req.body.email, password:req.body.password } )
			.without('password')
			.run(conn)
			.then(cursor => cursor.toArray())
			.then(user => {

				if (user.length){

					req.session.user = user[0]

					return res.status(200).json({
						token: jwt.sign(user[0].id, Config.secret, { expiresInMinutes: 1}),
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

	})	
	.error(err => res.send(err) )
}