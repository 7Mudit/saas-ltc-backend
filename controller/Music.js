const {checkApiLimit , increaseApiLimit} = require('../utils/ApiLimit')
const Replicate = require("replicate");
const {checkSubscription} = require('../utils/Subscription')

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN || "",
  });

  exports.musicController = async(req,res) => {
    try{
        const {userId , prompt} = req.body
        if(!userId || !prompt) {
            return res.status(400).json({
                success : false,
                message : "Userid and messages are required"
            })
        }

        const freeTrial = await checkApiLimit(userId)
        const isPro = await checkSubscription(userId)

        if(!freeTrial && !isPro){
            return res.status(403).json({
                success : false,
                message : "Free trial has expired"
            })
        }
        const response = await replicate.run(
            "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
            {
              input: {
                prompt_a: prompt,
              },
            }
          );
          if (!isPro) await increaseApiLimit(userId);


          return res.status(200).json({
            success : true,
            message : "Succesfully done",
            data : response
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