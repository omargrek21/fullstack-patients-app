const mongoose = require('mongoose');
const Patient = require("./patient");

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'name cannot be blank'
    },
    status: {
        type: Boolean,
        default: true,
        required: 'status cannot be blank'
    },
    branch:{
        type: String,
        required: false
    },
    patients: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Patient"
        }
    ],
    created_date: {
        type: Date,
        default: Date.now()
    }
});

clientSchema.pre("remove", async function(next) {
  try {
    // find all patients relative to this insurance company
    
    let patients = await Patient.find({_id:this.patients});
    // remove the id of the insurance company from their insurance list
    patients.insurance_company.remove(this.id);
    // save that user
    await patients.save();
    // return next
    return next();
  } catch (err) {
    return next(err);
  }
});

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;