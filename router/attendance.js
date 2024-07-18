import express from "express";
import { StudentInfo } from "../models/student.js";
const router = express.Router();

router.post( "/", async ( request, response ) =>
{
    const { students: attendanceStudents, date, studentClass: age } = request.body;

    if ( !attendanceStudents || attendanceStudents.length === 0 )
    {
        return response.status( 400 ).json( { message: "الرجاء إضافة أسماءالحضور" } );
    }
    if ( !age || age === "" )
    {
        return response.status( 400 ).json( { message: "الرجاء تحديد الحلقة" } );
    }

    const autoDate = new Date();
    const fullDate = `${ autoDate.getDate() }/${ autoDate.getMonth() + 1 }`;

    async function add ( date ) {
        try
        { 
            const allStudents = await StudentInfo.find( { age } );

            const studentNames = new Set( attendanceStudents.map( student => student.name ) );
            const allStudentNames = new Set( allStudents.map( student => student.name ) );


            for ( const student of allStudents )
            {
                const isPresent = studentNames.has( student.name );

                if ( !student.daysOfAttendance.attendance )
                {
                    student.daysOfAttendance.attendance = { days: [], total: 0 };
                }
                if ( !student.daysOfAttendance.absence )
                {
                    student.daysOfAttendance.absence = { days: [], total: 0 };
                }

                if ( isPresent ) {
                    if ( !student.daysOfAttendance.attendance.days.includes( date ) )  {
                        
                        if ( student.daysOfAttendance.absence.days.includes( date ) ) {
                            student.daysOfAttendance.absence.days = student.daysOfAttendance.absence.days.filter( day => day !== date );
                            student.daysOfAttendance.absence.total = Math.max( 0, student.daysOfAttendance.absence.total - 1 );
                        }
                        student.daysOfAttendance.attendance.days.push( date );
                        student.daysOfAttendance.attendance.total += 1;
                    }
                }
                else {
                    if ( !student.daysOfAttendance.attendance.days.includes( date ) && !student.daysOfAttendance.absence.days.includes( date ) )
                    {
                        student.daysOfAttendance.absence.days.push( date );
                        student.daysOfAttendance.absence.total += 1;
                    }
                }
            }

            await Promise.all( allStudents.map( student => student.save() ) );

            response.status( 200 ).json( {
                message: "تم تسجيل الحضور بنجاح"

            } );
        } catch ( error )
        {
            response.status( 500 ).json( { message: "حدث خطأ", error: error.message } );
        }
    }

    try
    {
        if ( date === "" )
        {
            await add( fullDate );
        } else
        {
            await add( date );
        }
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
                "daysOfAttendance.attendance.total" : 0 ,
                "daysOfAttendance.absence.days" : [] ,
                "daysOfAttendance.absence.total": 0,
                "pagesOfRecitation.newPages": [],
                "pagesOfRecitation.oldPages": [],
                "pagesOfRecitation.total":0
        }} );

        res.json( { updatedCount: "تم" } );
    } catch ( error )
    {
        console.error( 'Error updating documents:', error );
        res.status( 500 ).json( { message: 'Error updating documents' } );
    }
} );

export default router;
