import express from "express";
import { StudentInfo } from "../models/student.js";
const router = express.Router();

router.get( "/", async ( request, response ) =>
{
  const { listTransfer } = request.body;
  try
  {
    const data = await StudentInfo.find( {} );
    response.status( 200 ).json( { data } );
  } catch ( error )
  {
    response.status( 500 ).json( { message: "يوجد خطأ في الاتصال الرجاء المحاولة لاحقا" } );
  }
} );

router.put( "/", async ( request, response ) =>
{
  const { listTransfer, newClass } = request.body;

  try
  {
    const updatePromises = listTransfer.map( async ( student ) =>
    {
      return await StudentInfo.findOneAndUpdate(
        { name: student },
        { age: newClass },
        { new: true }
      ).exec();
    } );

    const results = await Promise.allSettled( updatePromises );

    const successfulUpdates = results.filter( result => result.status === 'fulfilled' );
    const failedUpdates = results.filter( result => result.status === 'rejected' );

    response.status( 200 ).json( {
      message: "تم تحديث بيانات الطلاب بنجاح",
      successfulUpdates,
      failedUpdates
    } );
  } catch ( error )
  {
    console.error( error );
    response.status( 500 ).json( { message: "يوجد خطأ في الاتصال، الرجاء المحاولة لاحقًا" } );
  }
} );



export default router;