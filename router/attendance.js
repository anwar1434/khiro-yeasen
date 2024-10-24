import express from "express";
import { StudentInfo } from "../models/student.js";
const router = express.Router();

router.put( "/:id", async ( request, response ) =>
{
    const id = request.params.id;
    const { daysOfAttendance , numberOfDay } = request.body;

    try
    {
        const student = await StudentInfo.findById( id ).exec();

        if ( !student )
        {
            return response.status( 404 ).json( { message: "الطالب غير موجود" } );
        }

        student.daysOfAttendance.days = daysOfAttendance;
        
        await student.save();

        response.status( 200 ).json( { message: "تم تحديث بيانات الطالب بنجاح", student } );
    } catch ( error )
    {
        response.status( 500 ).json( { message: "حدث خطأ", error: error.message } );
    }
} );

router.get( '/', async ( req, res ) =>
{
    try
    {

        // تطبيق التحديثات باستخدام updateMany
        const result = await StudentInfo.updateMany( {}, {
            $set: {
                "daysOfAttendance.attendance.days": [],
                "daysOfAttendance.attendance.total": 0,
                "daysOfAttendance.absence.days": [],
                "daysOfAttendance.absence.total": 0,
                "pagesOfRecitation.newPages": [],
                "pagesOfRecitation.oldPages": [],
                "pagesOfRecitation.total": 0
            }
        } );

        res.json( { updatedCount: "تم" } );
    } catch ( error )
    {
        console.error( 'Error updating documents:', error );
        res.status( 500 ).json( { message: 'Error updating documents' } );
    }
} );

export default router;
