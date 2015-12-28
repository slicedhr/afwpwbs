import Crypto from 'crypto'

const saltLength = 9;
const set = 'A554CD3449F9E3E9C4E6CBC7C4DE5';

function createHash (password, cb){

	let salt = generateSalt(saltLength),

		hash = md5(password + salt);

	cb(salt +  hash)
}

function validateHash (password, hash){

	let salt = hash.substr(0, saltLength),

		validHash = salt + md5(password + salt);

	return hash === validHash;

}

function md5 (string){

	return Crypto
			.createHash('md5')
			.update(string)
			.digest('hex');

}

function generateSalt(len){

	let	setLen = set.length,
		salt = '';

	for (let i = 0; i < len; i++) {
		let p = Math.floor(Math.random() * setLen)
		salt += set[p]
	};

	return salt;
}


export { createHash, validateHash }