import express from "express";
import { StudentInfo } from "../models/student.js";
const router = express.Router();

router.get( "/", async ( request, response ) =>
{
    try
    {
        const students = await StudentInfo.find( {} );
        const ageList = students.map( item => item.age );
        const uniqueAges = [...new Set( ageList )];

        response.status( 200 ).json( { data: students, classStudent: uniqueAges } );
    } catch ( error )
    {
        response.status( 500 ).json( { message: "يوجد خطأ في الاتصال الرجاء المحاولة لاحقا" } );
    }
} );

router.get( "/:id", async ( request, response ) =>
{
    const { id } = request.params;
    try
    {
        const result = await StudentInfo.findById( id )
        return response.status( 200 ).json( { result } );
    }
    catch ( error ) { response.status( 500 ).json( { message: "يوجد خطأ في الاتصال الرجاء محاولة لاحقا" } ) }
} );

router.post( "/", async ( request, response ) =>
{
    const { name, father, age, phoneNumber } = request.body;


    try
    {
        // Validate required fields
        if ( !name || !age || !father )
        {
            response.status( 400 ).json( { message: "يجب تعبأة جميع البيانات" } );
            return;
        }

        // Check if student already exists
        const studentExists = await StudentInfo.findOne( { name } );
        if ( studentExists )
        {
            response.status( 400 ).json( { message: "الطالب موجود بالفعل" } );
            return;
        }

        // Create and save the new student
        const newStudent = new StudentInfo( {
            name,
            father,
            age,
            phoneNumber
        } );
        await newStudent.save();
        response.status( 200 ).json( { message: "تمت اضافة الطالب بنجاح" } );

    } catch ( error )
    {
        response.status( 500 ).json( { message: "يوجد خطأ في الاتصال الرجاء المحاولة لاحقا" } );
    }
} );

router.put( "/:id", async ( request, response ) =>
{
    const { id } = request.params;
    const {
        name,
        father,
        age,
        phoneNumber,
        daysOfAttendance,
        totaldaysOfAttendance,
        daysOfabsence,
        totaldaysOfabsence,
        newPage, 
        totalPages
    } = request.body;

    try
    {
        const student = await StudentInfo.findByIdAndUpdate(
            id,
            {
                name,
                father,
                age,
                phoneNumber,
                "daysOfAttendance.attendance.days": daysOfAttendance,
                "daysOfAttendance.attendance.total": totaldaysOfAttendance,
                "daysOfAttendance.absence.days": daysOfabsence,
                "daysOfAttendance.absence.total": totaldaysOfabsence,
                "pagesOfRecitation.newPages":newPage,
                "pagesOfRecitation.total":totalPages
            },
            { new: true }
        ).exec();

        if ( !student )
        {
            return response.status( 404 ).json( { message: "لم يتم العثور على الطالب" } );
        }

        response.status( 200 ).json( { message: "تم تحديث بيانات الطالب بنجاح" } );
    } catch ( error )
    {
        response.status( 500 ).json( { message: "يوجد خطأ في الاتصال، الرجاء المحاولة لاحقًا" } );
    }
} );

router.delete( "/:id", async ( request, response ) =>
{
    try
    {
        const { id } = request.params
        const student = await StudentInfo.findByIdAndDelete( id )
        if ( !student ) { return response.status( 404 ).send( "الطالب محذوف بالفعل" ) }
        return response.status( 200 ).send( "تم حذف الطالب  بنجاح" )
    }
    catch ( error ) { response.status( 500 ).json( { message: "يوجد خطأ في الاتصال الرجاء محاولة لاحقا" } ) }
} );

export default router;