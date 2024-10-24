import express from "express";
import { StudentInfo } from "../models/student.js";

const router = express.Router();

router.post( '/', async ( req, res ) =>
{
    const { subjectName, className } = req.body;

    if ( !subjectName )
    {
        return res.status( 400 ).json( { message: 'الرجاء توفير اسم المادة واسم الصف' } );
    }

    try
    {
        const updatedStudents = await StudentInfo.updateMany(
            { age: className },
            { $addToSet: { subjects: { name: subjectName, grade: null } } },
            { new: true }
        );

        if ( updatedStudents.modifiedCount === 0 )
        {
            return res.status( 404 ).json( { message: 'لم يتم العثور على طلاب لهذا الصف' } );
        }

        res.status( 200 ).json( { message: 'تمت إضافة المادة بنجاح' } );
    } catch ( error )
    {
        console.error( 'Error adding subject:', error );
        res.status( 500 ).json( { message: 'حدث خطأ أثناء الاتصال بالخادم. الرجاء المحاولة لاحقًا.', error: error.message } );
    }
} );

router.put( '/', async ( req, res ) =>
{
    const { studentId, subjectName, grade } = req.body;

    if ( !studentId || !subjectName || typeof grade !== 'number' )
    {
        return res.status( 400 ).json( { message: 'يرجى تقديم studentId و subjectName و grade كرقم.' } );
    }
    console.log('Request received:', req.body);

    try
    {
        const updatedStudent = await StudentInfo.findOneAndUpdate(
            { _id: studentId, 'subjects.name': subjectName },
            { $set: { 'subjects.$.grade': grade } },
            { new: true }
        );

        if ( !updatedStudent )
        {
            return res.status( 404 ).json( { message: 'الطالب أو المادة غير موجودة.' } );
        }

        res.status( 200 ).json( { message: 'تم تحديث درجة الطالب بنجاح.', updatedStudent } );
    } catch ( error )
    {
        res.status( 500 ).json( { message: 'حدث خطأ أثناء تحديث درجة الطالب', error } );
    }
} );




export default router;
