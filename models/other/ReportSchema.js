import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    nameOfReporter: {
        type: String,
        required: true,
        trim: true 
    },
    emailOfReporter: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
           
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    phonenum: {
        type: String, 
        required: true,
        trim: true
    },
    nameOfMinister: {
        type: String,
        required: true
    },
    church: {
        type: String,
        required: true
    },
    emailOfReported: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); 
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    offense: {
        type: String,
        required: true
    }
}, { timestamps: true }); 

export default mongoose.model("Report", reportSchema);
