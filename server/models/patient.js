var mongoose= require('mongoose');
var validator= require('validator');
const jwt=require('jsonwebtoken');
const _=require('lodash');

var PatientSchema=new mongoose.Schema({
  email:{
    required:true,
    type:String,
    minlength:5,
    trim:true,
    unique:true,
    validate:{
      validator:validator.isEmail,
      message:'{VALUE} is not a valid e-mail'
    }
  },
  firstName:{
    required:true,
    type:String
  },
  lastName:{
    required:true,
    type:String
  },
  password:{
    required:true,
    type:String,
    minlength:6
  },
  primaryPhone:String,
  secondaryPhone:String,
  gender:String,
  pregnant:Boolean,
  dateOfBirth:Date,
  address:{
    street:String,
    city:String,
    state:String,
    zip:String,
  },
  insurances:[{
    groupName:String,
    memberId:String,
    startDate:String,
    payerId:String,
    primary:Boolean,
    color:String,
    copay:String,
    covered:Boolean,
    visits:Number,
    deductible:Number,
    outOfPocket:Number
  }],
  referredBy:String,
  emergencyContact:String,
  emergencyPhone:String,
  appointments:[{
    type:Number,
    unique:true,
    ref:'Appointment'
  }],
  signedDisclosure:Boolean,
  tokens:[{
    access:{
      type:String,
      required:true
    },
    token:{
      type:String,
      required:true
    },
    createdAt:Date
  }],
  emailOptions:{
    reminders:Boolean
  },
  consent:{
    signature:String,
    date:Date
  }
})

PatientSchema.methods.generateAuthToken=function(){
  var patient=this; // instance object
  var access='auth';
  var token=jwt.sign({_id:patient._id.toHexString(),access},process.env.JWT_SECRET);

  patient.tokens.push({access,token,createdAt:new Date()})
  return patient.save().then(()=>{
    return token;
  });
};

// Will need a cron function to automatically expire/remove tokens after
// a period of time(20 minutes? need to be HIPAA compliant)
PatientSchema.statics.findByToken=function(token){
  var Patient=this; // model object
  var decoded;

  try {
    decoded=jwt.verify(token,process.env.JWT_SECRET);
  } catch (e){
    return Promise.reject();
  }

  return Patient.findOne({
    '_id':decoded._id,
    'tokens.token':token,
    'tokens.access':'auth'
  });
}

PatientSchema.methods.removeAppointment=function(appointmentId){
  var patient=this;
  return patient.update({
    $pull:{
      appointments:appointmentId
    }
  })
}

PatientSchema.methods.removeToken=function(token){
  var patient= this;
  return patient.update({
    $pull:{
      tokens:{token}
    }
  })
};

PatientSchema.methods.updateProfile=function(patientObj){
  var patient=this;
  return patient.update(patientObj)
}

PatientSchema.post('update',(error,doc,next)=>{
  console.log('save error detected')
  if (error.name=== 'MongoError' && error.code===11000){
    next(new Error('That email is already taken'));
  } else {
    next(error);
  }
})

var Patient=mongoose.model('Patient', PatientSchema)

module.exports={Patient}
