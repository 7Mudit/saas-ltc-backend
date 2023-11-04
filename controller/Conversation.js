const {OpenAI} = require("openai")
const {checkApiLimit , increaseApiLimit} = require('../utils/ApiLimit')

const {checkSubscription} = require('../utils/Subscription')

const openai  = new OpenAI({
    apiKey : process.env.OPENAI_API_KEY,
})


const instructionMessageForConversation = {
    role: "system",
    content: "You are an AI conversationalist. Help the user with their queries.",
  };

  exports.conversationController = async(req,res) => {
    try{
        const {userId , messages} = req.body
        if(!userId || !messages) {
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
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [instructionMessageForConversation, ...messages],
          });
          if (!isPro) await increaseApiLimit(userId);


          return res.status(200).json({
            success : true,
            message : "Succesfully done",
            data : response.choices[0].message
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