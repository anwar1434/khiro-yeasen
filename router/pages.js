import express from "express";
import { StudentInfo } from "../models/student.js";

const router = express.Router();

router.post( "/", async ( request, response ) =>
{
    const { name, pages, typeOfPages, time } = request.body;

    // التحقق من وجود جميع البيانات المطلوبة
    if ( !name || !pages || !typeOfPages )
    {
        return response.status( 400 ).json( { message: "أدخل جميع البيانات المطلوبة" } );
    }

    // التحقق من أن pages هي قائمة من السلاسل النصية
    if ( !Array.isArray( pages ) || !pages.every( page => typeof page === 'string' ) )
    {
        return response.status( 400 ).json( { message: "الصفحات يجب أن تكون قائمة من السلاسل النصية" } );
    }

    try
    {
        const student = await StudentInfo.findOne( { name: new RegExp( `^${ name }$`, 'i' ) } );

        if ( !student )
        {
            return response.status( 404 ).json( { message: "الطالب غير موجود" } );
        }

        // تهيئة الصفحات إذا لم تكن موجودة
        if ( !student.pagesOfRecitation )
        {
            student.pagesOfRecitation = { newPages: [], oldPages: [], total: 0 };
        }

        const pagesAlreadyExist = [];
        const notVailed = [];

        // إضافة الصفحات الجديدة
        for ( let page of pages )
        {
            const pageInt = parseInt( page, 10 );
            if ( isNaN( pageInt ) )
            {
                notVailed.push( page );
                continue;
            }

            let exists;
            if ( typeOfPages === "جديدة" )
            {
                exists = student.pagesOfRecitation.newPages.some( entry => entry.page === pageInt );
                if ( !exists )
                {
                    student.pagesOfRecitation.newPages.push( { date: time, page: pageInt } );
                }
            } else if ( typeOfPages === "مراجعة" )
            {
                exists = student.pagesOfRecitation.oldPages.some( entry => entry.page === pageInt );
                if ( !exists )
                {
                    student.pagesOfRecitation.oldPages.push( { date: time, page: pageInt } );
                }
            }

            if ( exists )
            {
                pagesAlreadyExist.push( pageInt );
            }
        }

        // تحديث إجمالي الصفحات
        student.pagesOfRecitation.total += pages.length - pagesAlreadyExist.length - notVailed.length;
        await student.save();

        // إعداد الرسالة الناتجة
        const successMessage = createSuccessMessage( pagesAlreadyExist, notVailed, pages.length );
        return response.status( 200 ).json( { message: successMessage } );

    } catch ( error )
    {
        return response.status( 500 ).json( { message: "حدث خطأ أثناء إضافة الصفحات", error: error.message } );
    }
} );

const createSuccessMessage = ( pagesAlreadyExist, notVailed, totalPages ) =>
{
    if ( pagesAlreadyExist.length === totalPages )
    {
        return `الصفحات التالية موجودة بالفعل: ${ pagesAlreadyExist.join( ", " ) }`;
    } else if ( pagesAlreadyExist.length > 0 )
    {
        return `تم إضافة الصفحات بنجاح. الصفحات التالية موجودة بالفعل: ${ pagesAlreadyExist.join( ", " ) }`;
    } else if ( notVailed.length === totalPages )
    {
        return `يجب تنزيل أرقام الصفحات: ${ notVailed.join( ", " ) }`;
    } else
    {
        return pagesAlreadyExist.length > 0 && notVailed.length > 0
            ? `يجب تنزيل أرقام الصفحات: ${ notVailed.join( ", " ) }, الصفحات التالية موجودة بالفعل: ${ pagesAlreadyExist.join( ", " ) }, تم تنزيل الصفحات المقبولة`
            : `تم تنزيل الصفحات بنجاح`;
    }
};

router.put( "/:id", async ( request, response ) =>
{
    const id = request.params.id;
    const { updateOldPagesList, updateNewPagesList } = request.body;

    try
    {
        const student = await StudentInfo.findById( id ).exec();

        if ( !student )
        {
            return response.status( 404 ).json( { message: "لم يتم العثور على الطالب" } );
        }
        if ( updateNewPagesList )
        {
            student.pagesOfRecitation.newPages = updateNewPagesList;
        }
        if ( updateOldPagesList )
        {
            student.pagesOfRecitation.oldPages = updateOldPagesList;
        }
        student.pagesOfRecitation.total -= 1;
        
        await student.save();

        response.status( 200 ).json( { message: "تم تحديث بيانات الطلاب بنجاح.", student } );
    } catch ( error )
    {
        response.status( 500 ).json( { message: "An error occurred.", error: error.message } );
    }
} );


export default router;
