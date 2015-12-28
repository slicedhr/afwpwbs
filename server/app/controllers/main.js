import R from 'rethinkdb'

let getFn = (options) => {

	/*options = {
		connection // the connection
		table: // --
		id: // if find by id
		query: // --
		populate: [ // values to populate
			{
				field: 'empresa',
				table: 'empresa',
				row: 'idEmpresa'
			}
		] ,

	}*/

	let { connection, table, query } = config

	let populate = options.populate || []

	let order = config.order || {}

    let tb = R.table(table)

  	return options.id

  				?

      				tb

      				.get(options.id)

      				.merge((result) => {

      					let obj = {}

      					let length = populate.length

      					for (var i = 0; i < length; i++) {

      						let item = populate[i]

      						obj[item.field] = R.table(item.table).get(result(item.row))

      					};

      					return obj

      				})
      			
      				.run(connection)

  				:

      			tb
      				.filter(query)

	      			.orderBy(order && order.field && order.in 
	      				? order.in === 'asc' 
	      				? R.asc(order.field) 
	      				: R.desc(order.field) 
	      				: R.desc('created_at'))

		      		.merge((result) => {

      					let obj = {}

      					let length = populate.length

      					for (var i = 0; i < length; i++) {

      						let item = populate[i]

      						obj[item.field] = R.table(item.table).get(result(item.row))

      					};

      					return obj

      				})

		      		.without('password')
		      		
		      		.run(connection)
		      		
		      		.then(cursor => cursor.toArray())

}

export { getFn as get }


export default class UserController {

	static get(req, res){

	    let id = req.query.id || req.params.id || undefined;

	    return getFn(id, false, req.query)
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
					.error(err => res.status(500).send(err))
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
