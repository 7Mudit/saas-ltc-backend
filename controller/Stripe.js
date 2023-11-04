const UserSubscription = require('../models/UserSubscription')
const Stripe = require('stripe')

const stripe =  new Stripe(process.env.STRIPE_API_KEY , {
    apiVersion : "2023-10-16"
}) 


exports.buySubscription = async(req,res) => {
    const settingsUrl = `${process.env.NEXT_PUBLIC_APP_URL}/settings`
    try{
        const {userId , user} = req.body;

        if(!userId || !user){
            return res.status(400).json({
                success : false,
                message : "Not found necessary details"
            })
        }
        const userSubscription = await UserSubscription.findOne({userId : userId})

        if(userSubscription && userSubscription.stripeCustomerId){
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer : userSubscription.stripeCustomerId , 
                return_url : settingsUrl
            })
            return res.status(200).json({
                success : true,
                message : "Already bought pro",
                url  : stripeSession.url
            })
        }

        const stripeSession = await stripe.checkout.sessions.create({
            success_url : settingsUrl , 
            cancel_url : settingsUrl , 
            payment_method_types : ["card"],
            mode : "subscription" , 
            billing_address_collection : "auto" ,
            customer_email : user.emailAddresses[0].emailAddress,
            line_items : [
                {
                    price_data : {
                        currency : "INR" ,
                        product_data : {
                            name : "LTC Pro" , 
                            description : "Use our AI"
                        },
                        unit_amount : 1000*100,
                        recurring : {
                            interval : "month"
                        }
                    },
                    quantity : 1 
                }
            ],
            metadata : {
                userId
            }
        })
        return res.status(200).json({
            success : true,
            message : "Successfully bought pro",
            url  : stripeSession.url
        })


    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success : false,
            message : "internal server error"
        })
    }
}