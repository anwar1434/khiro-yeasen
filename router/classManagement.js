import express from "express";
import { StructureClass } from "../models/structureClass.js"
const router = express.Router();

// Get all class
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

// Add new class
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

// Update class
router.put("/", async (request, response) => {  
  const { id, className, episodeProfessor, ageOfStudents } = request.body;
  console.log("Received data:", { id, className, episodeProfessor, ageOfStudents });
  
  try {
    const student = await StructureClass.findByIdAndUpdate(
      id,
      { className, episodeProfessor, ageOfStudents },
      { new: true }
    ).exec();

    if (!student) {
      console.log("Student not found.");
      return response.status(404).json({ message: "لم يتم العثور على الحلقة" });
    }

    response.status(200).json({ message: "تم تحديث بيانات الحلقة بنجاح" });
  } catch (error) {
    console.error("Update error:", error);
    response.status(500).json({ message: "يوجد خطأ في الاتصال، الرجاء المحاولة لاحقًا" });
  }
});


// Delete class
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