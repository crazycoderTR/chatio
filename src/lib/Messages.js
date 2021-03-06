const redisClient = require('../redisClient');
const _ = require('lodash');
const shortid = require('shortid');

function Messages(){
    this.client = redisClient.getClient()
}

module.exports = new Messages();

Messages.prototype.upsert = function({ roomId, message, userId, username, surname }){
    this.client.hset(
        'messages:' + roomId,
        shortid.generate(),
        JSON.stringify({
            userId,
            username,
            surname,
            message,
            when: Date.now()
        }),
        err => {
            if(err) console.error(err)
        }
    )
};

Messages.prototype.list = function(roomId, callback){
    let messagesList = [];
    this.client.hgetall('messages:' + roomId, function(err, messages){
        if(err){
            console.error(err);
            return callback([]);
        }
        else{
            for(let message in messages){
                messagesList.push(JSON.parse(messages[message]));
            }
    
            return callback(_.orderBy(messagesList, 'when', 'asc'));
        }
    })
};