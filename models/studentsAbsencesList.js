import mongoose from 'mongoose';

const AbsencesListSchema = new mongoose.Schema( {
  AbsencesListSchema: [Object],
} );
const AbsencesList = mongoose.model( 'AbsencesList', AbsencesListSchema );

export { AbsencesList };

