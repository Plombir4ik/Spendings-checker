const express = require("express")
const config = require("config")
const path = require("path")
const mongoose = require("mongoose")

const app = express()

app.use(express.json({ extended: true }))

app.use("/api/auth", require("./routes/auth.routes"))
app.use("/api/categories", require("./routes/category.routes"))
app.use("/api/transactions", require("./routes/transactions.routes"))
app.use("/api/reports", require("./routes/repotrs.routes"))

if(process.env.NODE_ENV === "production" ) {
    app.use(express.static('client/build'))

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })
}

const PORT = process.env.PORT || 5000

async function start(){
    try{
        await mongoose.connect(config.get("mongoUri"),{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }) 
        app.listen(PORT, () => {console.log("Server has been started on port " + PORT + "...")})
    }
    catch(e){
        console.log("Server error",e.message)
        process.exit(1)
    }
}

start()

