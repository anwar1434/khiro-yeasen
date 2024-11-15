import express  from "express";
import { StudentInfo } from "../models/student.js";
const router = express.Router();

router.get( "/:studentClass", async ( request, response ) =>
{
    const targetAge = request.params.studentClass;
    try
    {
        const students = await StudentInfo.find( { age: targetAge } ).sort( { name: 1 } )
        if ( !students || students.length === 0 )
        {
            return response.status( 404 ).json( { message: "لم يتم العثور على أي طالب في هذه الفئة العمرية" } );
        }

        // إرسال البيانات في الاستجابة
        return response.status( 200 ).json( { data: students } );
    } catch ( error )
    {
        // التعامل مع أي أخطاء قد تحدث
        console.error( "Error fetching students:", error );
        return response.status( 500 ).json( { message: "يوجد خطأ في الاتصال الرجاء محاولة لاحقاً" } );
    }
} );

export default router;
