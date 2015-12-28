import R from 'rethinkdb'
import Config from '../../config'
const ENTITY = 'user'

let getUser = (id, auth = false, q = false) => {

	let query = q && q.email && q.password ? q : q && q.query ? JSON.parse(q.query) : {}

    return R.connect(Config.db)
		      .then(conn => {

		        let table = R.table(ENTITY)

		        if (auth) 
		        	return table.get(id).without('password').run(conn)

		        else
			      	return id 	? 
				      			table
				      				.get(id)
				      				.merge({
						      			empresa: R.table('empresa').get(R.row('empresa'))
						      		})
				      				.run(conn) 
			      				: 
				      			table
				      				.filter(query)
					      			.orderBy(R.desc('created_at'))
					      			// .filter(user => user.hasFields('empresa'))
						      		.merge({
						      			empresa: R.table('empresa').get(R.row('empresa'))
						      		})
						      		.without('password')
						      		.run(conn)
						      		.then(cursor => cursor.toArray())
    })
}

export { getUser as getUser }


export default class UserController {

	static getUser(id, auth = false, query){

		return getUser(id, auth, query)

	}

	static get(req, res){

	    let id = req.query.id || req.params.id || undefined;

	    return getUser(id, false, req.query)
	      .then(data => res.send(data || { empty: true }))
	}

	static create(req, res, next){

		req.body.created_at = new Date()

		req.body.created_by = req.user.id

		R.connect(Config.db)
			.then(conn => {

				R.table(ENTITY)

					.insert(req.body, { returnChanges:true } )

					.run(conn)

					.then(result => {

						let changes = result.changes

						let length = changes.length

						let response = []

						if (length > 1)
							for (var i = 0; i < length; i++)
								response.push(changes[i].new_val)

						else
							response = changes[0].new_val

						return res.status(200).json(response)

					})
					.error(res.status(500).send)
			})

	}

	static update(req, res, next){

		req.body.updated_at = new Date()

		R.connect(Config.db)
			.then(conn => {

				R.table(ENTITY).get(req.params.id || req.query.id)
					.update(req.body)
					.run(conn)
					.then(cursor => res.status(200).json(req.body))
					.error(res.status(500).send)

			})

	}

	static delete(req, res, next){

		let data = {

			deleted_at: new Date(),

			deleted: true,

			deleted_by: req.user.id
		}

		R.connect(Config.db)
			.then(conn => {

				R.table(ENTITY).get(req.params.id || req.query.id)
					.update(data)
					.run(conn)
					.then(cursor => res.json(data))
					.error(res.status(500).send)

			})

	}

}