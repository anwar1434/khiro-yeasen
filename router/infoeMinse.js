import express from "express";
import { StudentInfo } from "../models/student.js";
const router = express.Router();

router.get( "/", async ( request, response ) =>
{
    try
    {
        const fatherList = await StudentInfo.find( {father: ""} );
        const phonList = await StudentInfo.find( {phoneNumber: null} );


        response.status( 200 ).json( { fatherList: fatherList, phonList: phonList } );
    } catch ( error )
    {
        response.status( 500 ).json( { message: "يوجد خطأ في الاتصال الرجاء المحاولة لاحقا" } );
    }
} );

export default router;