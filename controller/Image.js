const {OpenAI} = require("openai")
const {checkApiLimit , increaseApiLimit} = require('../utils/ApiLimit')

const {checkSubscription} = require('../utils/Subscription')

const openai  = new OpenAI({
    apiKey : process.env.OPENAI_API_KEY,
})


  exports.imageController = async(req,res) => {
    try{
        const {userId , prompt , amount =1 , resolution = "512x512"} = req.body
        console.log(userId)
        if(!userId || !prompt) {
            return res.status(400).json({
                success : false,
                message : "Userid and messages are required"
            })
        }

        const freeTrial = await checkApiLimit(userId)
        const isPro = await checkSubscription(userId)
        console.log(freeTrial , isPro)

        if(!freeTrial && !isPro){
            return res.status(403).json({
                success : false,
                message : "Free trial has expired"
            })
        }
        const response = await openai.images.generate({
            prompt,
            n: parseInt(amount, 10),
            size: resolution,
          });
          if (!isPro) await increaseApiLimit(userId);


          return res.status(200).json({
            success : true,
            message : "Succesfully done",
            data : response.data
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