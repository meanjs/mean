'use strict';

module.exports = {
	db: 'mongodb://localhost/mean-dev',
	app: {
		title: 'MEAN.JS - Development Environment'
	},
	facebook: {
		clientID: '588647347851720',
		clientSecret: 'd2870185a0b41ab0ec32ac9d023be5b0',
		callbackURL: 'http://local.meanjs.herokuapp.com:3000/auth/facebook/callback'
	},
	twitter: {
        clientID: 'f9JcCc0xSzEUkwF5E5ZKLQ',
        clientSecret: 'E9zzKZhZlZuy5T1qMsu3c75EkGf9yVwp0uAIOwtI0oM',
		callbackURL: 'http://localhost:3000/auth/twitter/callback'
	},
	google: {
		clientID: '751147574067-kt9q7nnkvns3b8cg742nsddk9d77k0bt.apps.googleusercontent.com',
		clientSecret: '-7acCDhnsbf22HoHB_8CkAHi',
		callbackURL: 'http://localhost:3000/auth/google/callback'
	},
	linkedin: {
        clientID: '77f1ywm1byjwpm',
        clientSecret: 'K6D9cufcuNIjcqUr',
		callbackURL: 'http://localhost:3000/auth/linkedin/callback'
	}
};