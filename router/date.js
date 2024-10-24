import express from "express";
import { DateSchema } from "../models/date.js"
const router = express.Router();

router.get( "/", async ( request, response ) =>
{
  try
  {
    const data = await DateSchema.find( {} );
    response.status( 200 ).json( { data } );
  } catch ( error )
  {
    response.status( 500 ).json( { message: "يوجد خطأ في الاتصال الرجاء المحاولة لاحقا" } );
  }
} );

router.post("/", async (request, response) => {
  const { month } = request.body;

  try {
    // Validate required fields
    if (!month || !month.numberOfMonth || !month.days || month.days.length === 0) {
      return response.status(400).json({ message: "يجب تعبأة جميع البيانات" });
    }

    // Check if month already exists
    const monthExists = await DateSchema.findOne({ 'month.numberOfMonth': month.numberOfMonth });
    if (monthExists) {
      return response.status(400).json({ message: "الشهر موجود بالفعل" });
    }

    // Create and save the new date entry
    const newDate = new DateSchema({
      month: {
        numberOfMonth: month.numberOfMonth,
        days: month.days 
      }
    });

    await newDate.save();
    response.status(201).json({ message: "تمت اضافة التواريخ بنجاح" });

  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "يوجد خطأ في الاتصال الرجاء المحاولة لاحقا" });
  }
});



router.delete( "/:id", async ( request, response ) =>
{
  try
  {
    const { id } = request.params
    const student = await DateSchema.findByIdAndDelete( id )
    if ( !student ) { return response.status( 404 ).send( "الشهر محذوف بالفعل" ) }
    return response.status( 200 ).send( "تم حذف الشهر  بنجاح" )
  }
  catch ( error ) { response.status( 500 ).json( { message: "يوجد خطأ في الاتصال الرجاء محاولة لاحقا" } ) }
} );


export default router;


