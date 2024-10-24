import mongoose from 'mongoose';

const dateSchema = new mongoose.Schema({
  month: {
    numberOfMonth: {
      type: Number,
      required: true 
    },
    days: [{
      type: String,
      required: true 
    }]
  }
});

const DateSchema = mongoose.model('Date', dateSchema);

export { DateSchema };
