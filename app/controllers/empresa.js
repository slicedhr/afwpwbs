import R from 'rethinkdb'
import Config from '../../config'

const entity = 'empresa'

export default class Empresa {
  	
	static get(req, res, next){

		R.connect(Config.db).then(conn => {
			R.table(entity).run(conn).then(cursor => {

						console.log(cursor.toArray())
					return res.send(JSON.stringify(cursor.toArray()))

				})
				.error(err => {
					console.log(err)
				})
				.finally(() => {
					conn.close()
					next()
				})
			})

	}

	static create(req, res, next){

		R.connect(Config.db)
			.then(conn => {

				R.table(entity)
					.insert(req.body)
					.run(conn)
					.finally(() => {
						conn.close()
					})

				return res.json(req.body)

			})

	}

}