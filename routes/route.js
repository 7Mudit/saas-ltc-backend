const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const {codeController} =require('../controller/Code') 
const {conversationController} = require('../controller/Conversation')
const {imageController} = require('../controller/Image')
const {musicController} = require('../controller/Music')
const {videoController} = require('../controller/Video')
const {checkSubs} = require('../controller/CheckSubscription')
const { buySubscription } = require('../controller/Stripe')
const {webhook} = require('../controller/Webhook')
const { checkApiLimit } = require('../controller/ApiLimit')


router.use('/webhook' ,bodyParser.raw({ type: 'application/json' }),  webhook)

router.use(express.json())

router.post("/code" , codeController)
router.post("/conversation" , conversationController)
router.post("/image" , imageController)
router.post("/music" , musicController)
router.post("/video" , videoController)
router.post("/checkSubscription" , checkSubs)
router.post('/stripe' , buySubscription)
router.post('/apiLimit' , checkApiLimit)


module.exports = router
