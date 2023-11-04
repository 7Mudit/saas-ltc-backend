const {OpenAI} = require("openai")
const {checkApiLimit , increaseApiLimit} = require('../utils/ApiLimit')

const {checkSubscription} = require('../utils/Subscription')

const openai  = new OpenAI({
    apiKey : process.env.OPENAI_API_KEY,
})

const instructionMessage = {
    role: "system",
    content:
      "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations",
  };


exports.codeController = async(req,res) => {
    try{
        const {userId , messages} = req.body;

        if(!userId || !messages){
            return res.status(400).json({
                success : false,
                message : "Messages and userid are required"
            })
        }

        const freeTrial = await checkApiLimit(userId)
        const isPro = await checkSubscription(userId)

        if(!freeTrial && !isPro){
            return res.status(403).json({
                success : false , 
                message : "Free trial has expired"
            })
        }
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [instructionMessage, ...messages],
        })


        if(!isPro) await increaseApiLimit(userId)

        return res.status(200).json({
            success : true, 
            message : "Prompt answer" ,
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