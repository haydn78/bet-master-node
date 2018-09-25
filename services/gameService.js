/**
 * 
 */
/**
 * 
 */
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const collectionName = 'games';
//const url = 'mongodb://localhost:27017/bet_master_db';
const url = 'mongodb://bet-master-node-client:bKH6WZ1bvIRxeHUZ@dev1-shard-00-00-hs27i.gcp.mongodb.net:27017,dev1-shard-00-01-hs27i.gcp.mongodb.net:27017,dev1-shard-00-02-hs27i.gcp.mongodb.net:27017/bet_master_db?ssl=true&replicaSet=Dev1-shard-0&authSource=admin&retryWrites=true';

var urlr = require('url');
class GameService{
	constructor(req, res){
		this.req = req
		this.res = res
	}
	
	getAllGames(){
		let self = this;
		try{
			MongoClient.connect(url,function(err, db) {
				assert.equal(null, err);
				let recordList = []
				let cursor = db.collection(collectionName).find();

				cursor.each(function(err, doc) {
					assert.equal(err, null);
					if (doc != null) {
						recordList.push(doc)
					} else {
						return self.res.status(200).json({
							status: 'success',
							data: recordList
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
	
	


	
	addGame(){
		let self = this;
		let record = this.req.body;
		try{
			console.log(this.req.body);
			
			MongoClient.connect(url,function(err, db) {
				assert.equal(null, err);
				db.collection(collectionName).insertOne (record, function(err, result) {
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

	
	findGames(){
		let self = this;
		let filters = this.req.body;
		var url_parts = urlr.parse(this.req.url, true);
		var query = url_parts.query;
        console.log(query.betid);
        if (query.betid != null && query.betid != '') {  
           filters = { "game.Bets.id": query.betid };
        }   
	
		try{
			console.log(this.req.body);
			console.log(filters)	
			MongoClient.connect(url,function(err, db) {
				assert.equal(null, err);
				let recordList = []
				let cursor = db.collection(collectionName).find({$and:[filters]});
				cursor.each(function(err, doc) {
					assert.equal(err, null);
					if (doc != null) {
						recordList.push(doc)
					} else {
						return self.res.status(200).json({
							status: 'success',
							data: recordList
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


	
	
	
	deleteGame(){
		let self = this;
		let game = this.req.body.game;
		try{
			console.log(this.req.body);
			MongoClient.connect(url,function(err, db) {
				assert.equal(null, err);
				db.collection(collection).remove({$and: [ {"game.name" : game.name }, {"game.id" :game.id}]},function(err, result) {
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


	replaceGame(){
		let self = this;
		let game = this.req.body.game;
		try{
			MongoClient.connect(url,function(err, db) {
				assert.equal(null, err);
			
		        db.collection(collectionName).replaceOne( {$and: [ {"game.name" : game.name }, {"game.id" :game.id}]} ,game,  { upsert: true }, function(err, result) {
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

	
	updateGame(){
		let self = this;
		let game = this.req.body.game;
		try{
			MongoClient.connect(url,function(err, db) {
				assert.equal(null, err);
				var newvalues = { $set: {"game.active" : game.active } };
		        db.collection(collectionName).updateOne( {$and: [ {"game.name" : game.name }, {"game.id" :game.id}]} ,newvalues, function(err, result) {
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
	

	
	removeAll(){
		let self = this;
		try{
	      
			MongoClient.connect(url,function(err, db) {
				assert.equal(null, err);
		        db.collection(collectionName).remove({}, function(err, result) {
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

	
	
}
module.exports = GameService
