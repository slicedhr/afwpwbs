import R from 'rethinkdb'
import Config from '../../config'

const ENTITY = 'empresa'

let getEmpresa = (id) => {
    
    return R.connect(Config.db)

		    .then(conn => {

		        let query = R.table(ENTITY)

		      	return id ? 
		      			query.get(id).run(conn) : 
		      			query.orderBy(R.desc('created_at')).run(conn).then(cursor => cursor.toArray())
                
    		})
}

export { getEmpresa as getEmpresa}

export default class Empresa {

	static getEmpresa(id){

		return getEmpresa(id)

	}
  	

	static get(req, res){

	    let id = req.query.id || req.params.id || undefined;

	    getEmpresa(id)
	      .then(data => res.send(data))

	}
  	
	
	static create(req, res, next){

		req.body.created_at = new Date()
		req.body.created_by = req.user.id

		R.connect(Config.db)
			.then(conn => {

				R.table(ENTITY)
					.insert(req.body,{returnChanges:true})
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

						conn.close()

						return res.status(200).json(response)

					})
					.error(err => {

						res.status(500).send(err)

						conn.close()

					})
			})

	}

	static update(req, res, next){

		req.body.updated_at = new Date()

		R.connect(Config.db)
			.then(conn => {

				R.table(ENTITY).get(req.params.id || req.query.id)
					.update(req.body)
					.run(conn)
					.then(cursor => {

						res.json(req.body)

						conn.close() 

					})
					.error(err => {
						
						res.status(500).send(err)

						conn.close() 
					})

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
					.then(cursor => { 

						res.json(data)

						conn.close() 

					})
					.error(err => {

						res.status(500).send(err)

						conn.close() 

					})

			})
			.error(res.send)

	}

}