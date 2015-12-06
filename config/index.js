import path from 'path'
import FS from 'fs'
var rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';


var config = {
  development: {
    root: rootPath,
    app: {
      name: 'afv2'
    },
    port: 3000,
    db: { db: 'activos_fijos_main', host:'192.168.0.19', port: '28015' },
    secret: require('./secret') || 'ola k ase?'
  },


  production: {
    root: rootPath,
    app: {
      name: 'afv2'
    },
    port: 3000,
    db: {db: 'afv2_production'},
    secret: require('./secret') || 'ola k ase?'
  }
};

module.exports = config[env];
