const UserApiLimit = require('../models/UserApiLimit')

exports.increaseApiLimit = async(userId) => {
    try{
        // fetch clerk id from the frontend

        if(!userId){
            return;
        }

        let userApiLimit = await UserApiLimit.findOne({userId : userId})

        if(userApiLimit){
            userApiLimit.count += 1;
            await userApiLimit.save()
        }else{
            userApiLimit = new UserApiLimit({
                userId : userId , count : 1
            });
            await userApiLimit.save()
        }
    }
    catch(err){
        console.log(err)
    }
}


exports.checkApiLimit = async(userId) => {
    try{
        if(!userId){
            return;
        }

        const userApiLimit = await UserApiLimit.findOne({
            userId : userId
        })

        if(!userApiLimit || userApiLimit.count < 5){
            return true;
        }else{
            return false;
        }
    }
    catch(Err){
        console.log(Err)
    }
}