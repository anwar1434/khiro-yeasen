import express from "express";
import { StructureClass } from "../models/structureClass.js"
const router = express.Router();

router.get( "/", async ( request, response ) =>
{
  try
  {
    const data = await StructureClass.find( {} );
    response.status( 200 ).json( { data } );
  } catch ( error )
  {
    response.status( 500 ).json( { message: "يوجد خطأ في الاتصال الرجاء المحاولة لاحقا" } );
  }
} );

router.post( "/", async ( request, response ) =>
{
  const { className, episodeProfessor, ageOfStudents } = request.body;
  try
  {
    // Validate required fields
    if ( !className || !episodeProfessor || !ageOfStudents )
    {
      response.status( 400 ).json( { message: "يجب تعبأة جميع البيانات" } );
      return;
    }

    // Check if student already exists
    const studentExists = await StructureClass.findOne( { className } );
    if ( studentExists )
    {
      response.status( 400 ).json( { message: "الحلقة موجود بالفعل" } );
      return;
    }

    // Create and save the new student
    const newClass = new StructureClass( {
      className,
      episodeProfessor,
      ageOfStudents,
    } );
    await newClass.save();
    response.status( 200 ).json( { message: "تمت اضافة الحلقة بنجاح" } );

  } catch ( error )
  {
    response.status( 500 ).json( { message: "يوجد خطأ في الاتصال الرجاء المحاولة لاحقا" } );
  }
} );

router.put( "/", async ( request, response ) =>
{
  const { id, className, episodeProfessor, ageOfStudents } = request.body;
  try
  {
    const student = await StudentInfo.findByIdAndUpdate( id, { className, episodeProfessor, ageOfStudents }, { new: true } ).exec();

    if ( !student ) { return response.status( 404 ).json( { message: "لم يتم العثور على الطالب" } ); }

    response.status( 200 ).json( { message: "تم تحديث بيانات الحلقة بنجاح" } );
  }
  catch ( error ) { response.status( 500 ).json( { message: "يوجد خطأ في الاتصال، الرجاء المحاولة لاحقًا" } );   }
} );

router.delete( "/:id", async ( request, response ) =>
{
  try
  {
    const { id } = request.params
    const classDelete = await StructureClass.findByIdAndDelete( id )
    if ( !classDelete ) { return response.status( 404 ).send( "الطالب محذوف بالفعل" ) }
    return response.status( 200 ).send( "تم حذف الحلقة  بنجاح" )
  }
  catch ( error ) { response.status( 500 ).json( { message: "يوجد خطأ في الاتصال الرجاء محاولة لاحقا" } ) }
} );

export default router;