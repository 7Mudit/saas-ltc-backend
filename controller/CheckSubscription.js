const {checkSubscription} = require('../utils/Subscription')

exports.checkSubs= async(req,res) => {
    try{
        const {userId} = req.body;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "UserId is required",
            });
        }
        const result = await checkSubscription(userId)
        return res.status(200).json({
            success : true ,
            message : "Result is here",
            data : result
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}