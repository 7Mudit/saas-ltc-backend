const mongoose = require('mongoose')


const connectToDb = async() => {

    await mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("Mongodb connected succesfully"))
    .catch((err) => console.log(err))
}

module.exports = connectToDb