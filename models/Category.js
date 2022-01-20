const {Schema,model, Types} = require("mongoose")

const schema = new Schema({
    name: {type : String, required : true},
    description : {type : String},
    owner : {type : Types.ObjectId, ref: "User", required : true}

})

const name = "Category"

module.exports = model(
    name,
    schema)