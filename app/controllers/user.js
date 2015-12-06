import R from 'rethinkdb'
import Config from '../../config'

const ENTITY = 'user'

let getUser = (id) => {
    
    return R.connect(Config.db)
      .then(conn => {

        let query = R.table(ENTITY)

      	return id ? 
      			query.get(id).without('password').run(conn) : 
      			query.orderBy(r.desc('created_at')).without('password').run(conn).then(cursor => cursor.toArray())
                
    })
}

export { getUser as getUser}


export default class UserController {

	static getUser(id){

		return getUser(id)

	}
  	

	static get(req, res){

	    let id = req.query.id || req.params.id || undefined;

	    getUser(id)
	      .then(res.send)
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