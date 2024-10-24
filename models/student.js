import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
        trim: true
    },
    father: { type: String },
    age: { type: String },
    phoneNumber: { type: Number },

    daysOfAttendance: {
            days: [String],
            total: { type: Number, default: 0 }
    },

    pagesOfRecitation: {
        newPages: [],
        oldPages: [],
        total: { type: Number, default: 0 }
    },
    subjects: [
        {
            name: { type: String, required: true },  
            grade: { type: Number, default: 0 }    
        }
    ]

});

const StudentInfo = mongoose.model( 'StudentInfo', studentSchema );

export { StudentInfo };
