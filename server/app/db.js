import R from "rethinkdb";
import Config from "../config"
import Async from "async"

//Create DB
let prefix = 'wc_'

let argv = process.argv[4]

let defaultDb = Config.db.db

let db = argv || defaultDb

let tables = []

if (!argv || argv === 'dummy')
	tables = [
			{
				name: 'user',
				index: [
					'email',
					'empresa'
				]
			},
			{
				name: 'empresa',
				index: [
					'nit'
				]
			}
		]
else {

	tables = [
		{
			name: 'activo',
			index: [
				'placaactual',
				'idpadre',
				'empresa',
			]
		}
	]

	db = prefix + db
	
}

console.log('Connecting to server...')


//IF All Update DBs

if (argv && argv === 'all'){

	R.connect().then(conn => {

		R.dbList().run(conn).then(list => {

			let dbList = []

			Async.eachSeries(list, (db, done) => {

				if (!db.startsWith('wc_'))
					done()

				else{

					dbList.push(db)

					done()

				}

			}, () => {

				if (dbList.length)
					Async.eachSeries(dbList, (db, done) => {

						createDb(db, done)

					}, (err) => {

						console.log('Finish!')

						process.exit()

					})

				else{

					console.log('Finish!')

					process.exit()

				}


			})

		})
	})

}

else if(argv && argv === 'dummy')

	R.connect().then(conn => {
		R.db(defaultDb).table(tables[0].name).insert(
			[
				{
				nombres: 'Admin Admin',
				email: 'admin@admin.com',
				password: 'admin',
				permissions: {
					admin: true
				},
				role: 'admin',
				empresa: '9b03c81c-8ca9-4044-84be-3014c5fcc433'
			},
			{
				nombres: 'Pepito Perez',
				email: 'customer@customer.com',
				password: 'customer',
				permissions: {

					activo: {
						read: true,
						delete: false,
						update: true,
						create: false,
					}
				},
				role: 'customer',
				empresa: '78f3c5b6-90f6-4309-911b-f5e32a26952c'
			}
			])
			.run(conn)
			.then(done => {
				
				console.log('Users created.')

				R.db(defaultDb).table(tables[1].name).insert(
				{
					razon_social: 'wilcatec',
					nit: '123456789',
					id:'78f3c5b6-90f6-4309-911b-f5e32a26952c'
				},{
					razon_social: 'admin',
					id: '9b03c81c-8ca9-4044-84be-3014c5fcc433'
				}
				).run(conn).then(done => {
					console.log('Empresa created!')
					process.exit()
				}).catch(err => console.log('err', err))

			})
			.catch(err => console.log('err', err))

	
	})

else
	createDb(db, function(){
		console.log('Finish!')
		process.exit()
	})


function createDb(db, done){

	R.connect().then(conn => {

		console.log('Connected.')

		R.dbList()
				.contains(db)
					.run(conn)
						.then(existsdb => {

							if (existsdb){

								console.log(`Already exists DB ${db.replace('wc_','')}`)

								createTables(conn, db, done)

							}

							else
								R.dbCreate(db).run(conn).then(result => {

									console.log(`Db ${db.replace('wc_','')} created`)

									createTables(conn, db, done)

								}).error(val => {

									console.log('Failed to create BD')

									console.log(val)

								})
											

						})
		
	})
		
}

function createTables(conn, db, done){

	Async.eachSeries(tables, (table, cb) => {

		R.db(db)
			.tableList()
			.contains(table.name)
			.run(conn)
				.then(existsTable => {

					if(existsTable){
						
						console.log(`Already exists table ${table.name}`)

						createIndex(conn, db, table, cb)

					}

					else
						R.db(db)
							.tableCreate(table.name)
								.run(conn)
								.then(result => {
									console.log(`Table ${table.name} created.`)
										//console.log(result.config_changes[0].new_val)
									createIndex(conn, db, table, cb)
								})
								.error(err => {
									console.log(err)
									console.log(`Not created table ${table.name}.`)
								})

				})

	}, done)




}


function createIndex(conn, db, table, cb){

	let selected = R.db(db).table(table.name)

	Async.eachSeries(table.index, (index, callback) => {

		selected.indexList()
				.contains(index)
				.run(conn)
				.then(existsIndex => {

					if (!existsIndex)
						selected
							.indexCreate(index)
							.run(conn)
							.then(idx => {
								console.log(`Table ${table.name}: Index ${index} created`)
								callback()
							})

					else
						callback()

				})		

	}, cb)

}