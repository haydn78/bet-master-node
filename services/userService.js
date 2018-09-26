/**
 * 
 */
/**
 * 
 */
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
//const url = 'mongodb://localhost:27017/bet_master_db';

const url = 'mongodb://bet-master-node-client:bKH6WZ1bvIRxeHUZ@dev1-shard-00-00-hs27i.gcp.mongodb.net:27017,dev1-shard-00-01-hs27i.gcp.mongodb.net:27017,dev1-shard-00-02-hs27i.gcp.mongodb.net:27017/bet_master_db?ssl=true&replicaSet=Dev1-shard-0&authSource=admin&retryWrites=true';

var urlr = require('url');

class UserService{
	constructor(req, res){
		this.req = req
		this.res = res
	}
	
	getAllUsers(){
		let self = this;
		try{
			MongoClient.connect(url,function(err, db) {
				assert.equal(null, err);
				let userList = []
				let cursor = db.collection('users').find();

				cursor.each(function(err, doc) {
					assert.equal(err, null);
					if (doc != null) {
						userList.push(doc)
					} else {
						return self.res.status(200).json({
							status: 'success',
							data: userList
						})
					}
				});
			});
		}
		catch(error){
			return self.res.status(500).json({
				status: 'error',
				error: error
			})
		}
	}
	
	
	regsiterUser(){
		console.log("invoking post operation for register user");
		let user = this.req.body.user;
		let userStruct = this.req.body;
		console.log(this.req.body);
		let self = this;
		let filters = [{ "user.name": user.name }, {"user.email":user.email }];
		let userList = []; 
		this.findUsersCommon(filters,function(userList){
				console.log(userList.length);
				 if (userList.length == 0 ) {
						MongoClient.connect(url,function(err, db) {
							assert.equal(null, err);
							userStruct.user.points = 10000;
							db.collection('users').insertOne (userStruct, function(err, result) {
								 if (err) throw err;
								 db.close();
								 userList.push(userStruct);
								 return self.res.status(200).json({
										status: 'success',
										data: userList
									});
							 });
						});
				 }
				 else {
					 return self.res.status(200).json({
							status: 'success',
							data: userList
						});
				 }
			
		 });	
	
	}
	
	/*** Add User hidden
	addUser(){
		let self = this;
		let user = this.req.body;
		try{
			console.log(this.req.body);
			
			MongoClient.connect(url,function(err, db) {
				assert.equal(null, err);
				db.collection('users').insertOne (user, function(err, result) {
					 if (err) throw err;
					 db.close();
					 return self.res.status(200).json({
							status: 'success'
						});
				 });
			});
		}
		catch(error){
			return self.res.status(500).json({
				status: 'error',
				error: error
			})
		}
	}

	**/
	
	findUsers(filters){
		let self = this;
		if (filters == null || filters =='') {
		var url_parts = urlr.parse(this.req.url, true);
		var query = url_parts.query;
        console.log(query.username);
        console.log(query.useremail);
     	filters = [{ "user.name": query.username }, {"user.email":query.useremail }];
	    }
		let userList = []; 
		this.findUsersCommon(filters,function(userList){
				console.log(userList.length);
				 if (userList.length == 0 ) {
					 return self.res.status(201).json({
							status: 'success',
							data: []
						});
				 }
				 else {
					 return self.res.status(200).json({
							status: 'success',
							data: userList
						});
				 }
		});
	}


	deleteUser(){
		let self = this;
		let user = this.req.body.user;
		try{
			console.log(this.req.body);
			MongoClient.connect(url,function(err, db) {
				assert.equal(null, err);
				db.collection('users').remove({$and: [ {"user.name" : user.name }, {"user.email" :user.email}]},function(err, result) {
					 if (err) throw err;
					 	db.close();
					 	return self.res.status(200).json({
							status: 'success'
						});

				 });
				
			});
			}
			catch(error){
			return self.res.status(500).json({
				status: 'error',
				error: error
			})
		}
	}


	updateUser(){
		let self = this;
		let user = this.req.body.user;
		let userStruct = this.req.body;
		console.log(this.req.body);
		try{
			MongoClient.connect(url,function(err, db) {
				assert.equal(null, err);
			    
		        db.collection('users').replaceOne( {$and: [ {"user.name" : user.name }, {"user.email" :user.email}]} ,userStruct,  { upsert: true }, function(err, result) {
					 if (err) throw err;
					 db.close();
					 return self.res.status(200).json({
							status: 'success',
							data: userStruct
						});

				 });
				
			});
			}
		catch(err){
			return self.res.status(500).json({
				status: 'error',
				error: err
			})
		}
		
	}


	
	removeAll(){
		let self = this;
		try{
	      
			MongoClient.connect(url,function(err, db) {
				assert.equal(null, err);
		        db.collection('users').remove({}, function(err, result) {
					 if (err) throw err;
					 db.close();
					 return self.res.status(200).json({
							status: 'success'
						});

				 });
				
			});
			}
		catch(err){
			return self.res.status(500).json({
				status: 'error',
				error: err
			})
		}
		
	}

	
   findUsersCommon(filters,callback){
	   try {
			MongoClient.connect(url,function(err, db) {
				assert.equal(null, err);
				let userList = []; 
				console.log(filters);
				let cursor = db.collection('users').find({$and:filters});
				cursor.each(function(err, doc) {
					assert.equal(err, null);
					if (doc != null) {
                     userList.push(doc);
                     console.log("pushed");
					}
					else {
						console.log("done with find" + userList.length);
						callback(userList);
					}	             
				});
				
				
				
				});
			}
		catch(error){
			callback(error);
			}
		}
   
	payUserBet(){
		console.log("userservice:payUser:start");
		let self = this;
		var url_parts = urlr.parse(this.req.url, true);
		var query = url_parts.query;
       console.log("userservice:payUser:query:"+query.betid);
    	
        let filters = [{"user.UserBets.id": query.betid }];
		let userList = []; 
		this.findUsersCommon(filters,function(userList){
				console.log("userservice:payUser:foundusers:"+userList.length);
				for(let i=0;i<userList.length;i++)	{	
					let tmpUsr = userList[i];
					console.log("userservice:payUser:userpoints:find:points:"+tmpUsr.user.points+":Bets:"+tmpUsr.user.UserBets.length);
					let tmpUserbets = tmpUsr.user.UserBets;
				 	for(let j=0;j<tmpUserbets.length;j++)	{
						if (tmpUserbets[j].id == query.betid) {
							tmpUsr.user.points += (tmpUsr.user.UserBets[j].amount * tmpUsr.user.UserBets[j].odds);
							tmpUsr.user.UserBets[j].active = false;
							console.log("userservice:payUser:userpoints:after"+tmpUsr.user.points);
						}
					}
			
					try{
						MongoClient.connect(url,function(err, db) {
							assert.equal(null, err);
					        db.collection('users').replaceOne( {$and: [ {"user.name" : tmpUsr.user.name }, {"user.email" :tmpUsr.user.email}]} ,tmpUsr,  { upsert: true }, function(err, result) {
								 if (err) throw err;
								 db.close();
					         
							 });
							
						});
						}
					catch(err){
						console.log(err);
						return self.res.status(500);
					}
					 	
				 }
				 return self.res.status(200);
			 });	
	
	}

   
	
	clearUsersBets(){
		console.log("userservice:clearUser:start");
		let self = this;
		var url_parts = urlr.parse(this.req.url, true);
		var query = url_parts.query;
       console.log("userservice:clearUser:query:"+query.betid);
    	
        let filters = [{"user.UserBets.id": query.betid }];
		let userList = []; 
		this.findUsersCommon(filters,function(userList){
				console.log("userservice:clearUser:foundusers:"+userList.length);
				for(let i=0;i<userList.length;i++)	{	
					let tmpUsr = userList[i];
					console.log("userservice:clearUser:userpoints:find:points:"+tmpUsr.user.points+":Bets:"+tmpUsr.user.UserBets.length);
					let tmpUserbets = tmpUsr.user.UserBets;
				 	for(let j=0;j<tmpUserbets.length;j++)	{
						if (tmpUserbets[j].id == query.betid) {
							tmpUsr.user.UserBets[j].active = false;
							console.log("userservice:clearUser:userpoints:after"+tmpUsr.user.points);
						}
					}
			
					try{
						MongoClient.connect(url,function(err, db) {
							assert.equal(null, err);
					        db.collection('users').replaceOne( {$and: [ {"user.name" : tmpUsr.user.name }, {"user.email" :tmpUsr.user.email}]} ,tmpUsr,  { upsert: true }, function(err, result) {
								 if (err) throw err;
								 db.close();
					         
							 });
							
						});
						}
					catch(err){
						console.log(err);
						return self.res.status(500);
					}
					 	
				 }
				 return self.res.status(200);
			 });	
	
	}

	

	
	
}


module.exports = UserService
