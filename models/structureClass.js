import mongoose from 'mongoose';

const ClassSchema = new mongoose.Schema({
  className: {  
    type: String,
    required: true,
    trim: true
  },
  episodeProfessor: {
    type: [String],
    required: true,
  },
  ageOfStudents: {
    type: String,
    required: true,
    trim: true
  }
});
const StructureClass = mongoose.model('StructureClass', ClassSchema);

export { StructureClass };

