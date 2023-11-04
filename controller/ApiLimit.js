const UserApiLimit  = require('../models/UserApiLimit')

exports.checkApiLimit = async(req,res) => {
    try{
        const {userId} = req.body;
        if(!userId){
            return res.status(200).json({
                success : true,
                result : 0
            });
        }

        const userApiLimit = await UserApiLimit.findOne({ userId: userId });
        if(!userApiLimit){
            return res.status(200).json({
                success : true,
                result : 0
            });
        }

        return res.status(200).json({
            success : true,
            result : userApiLimit.count
        });
    }
    catch(Err){
        console.log(Err)
        return res.status(500).json({
            success : false,
            message : "Internal server occured"
        })
    }
}