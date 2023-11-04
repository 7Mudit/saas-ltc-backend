const { checkApiLimit, increaseApiLimit } = require("../utils/ApiLimit");
const Replicate = require("replicate");
const { checkSubscription } = require("../utils/Subscription");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

exports.videoController = async (req, res) => {
  try {
    const { userId, prompt } = req.body;
    if (!userId || !prompt) {
      return res.status(400).json({
        success: false,
        message: "Userid and messages are required",
      });
    }

    const freeTrial = await checkApiLimit(userId);
    const isPro = await checkSubscription(userId);

    if (!freeTrial && !isPro) {
      return res.status(403).json({
        success: false,
        message: "Free trial has expired",
      });
    }
    const response = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      {
        input: {
          prompt: prompt,
        },
      }
    );
    if (!isPro) await increaseApiLimit(userId);

    return res.status(200).json({
      success: true,
      message: "Succesfully done",
      data: response,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
