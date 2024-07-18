import express from "express";
import { StudentInfo } from "../models/student.js";
const router = express.Router();

router.post("/", async (request, response) => {
    const { name, pages, typeOfPages, time } = request.body;

    const autoDate = new Date();
    const fullDate = `${ autoDate.getDate() }/${ autoDate.getMonth() + 1 }`;

    // التحقق من الحقول المطلوبة
    if (!name || !pages || !typeOfPages) {
        return response.status(400).json({ message: "أدخل جميع البيانات المطلوبة" });
    }

    // التحقق من أن الحقول هي قائمة من السلاسل النصية
    if (!Array.isArray(pages) || !pages.every(page => typeof page === 'string')) {
        return response.status(400).json({ message: "الصفحات يجب أن تكون قائمة من السلاسل النصية" });
    }

    // التحقق من نوع الصفحات
    const validTypes = ["جديدة", "مراجعة"];
    if (!validTypes.includes(typeOfPages)) {
        return response.status(400).json({ message: "نوع الصفحات غير صالح" });
    }

    // الوظيفة الرئيسية لإضافة الصفحات
    const addPages = async (time) => {
        try {
            const student = await StudentInfo.findOne({ name: new RegExp(`^${name}$`, 'i') });

            if (!student) {
                return response.status(404).json({ message: "الطالب غير موجود" });
            }

            if (!student.pagesOfRecitation) {
                student.pagesOfRecitation = { newPages: [], oldPages: [], total: 0 };
            }

            const pagesAlreadyExist = [];

            for (let page of pages) {
                const pageInt = parseInt(page, 10); 

                let exists;

                if ( typeOfPages === "جديدة" ) 
                {
                    exists = student.pagesOfRecitation.newPages.some( entry => entry.pages === pageInt );

                    if (!exists) {
                        student.pagesOfRecitation.newPages.push( {date:time , peages:pageInt} );
                    }
                }

                else if ( typeOfPages === "مراجعة" )
                {
                    exists = student.pagesOfRecitation.oldPages.some(entry => entry.pages === pageInt);
                    if ( !exists ) 
                    {
                        student.pagesOfRecitation.oldPages.push({date:time , peages:pageInt});
                    }
                }

                if (exists) {
                    pagesAlreadyExist.push(pageInt);
                }
            }

            student.pagesOfRecitation.total += pages.length - pagesAlreadyExist.length;
            await student.save();

            const successMessage = pagesAlreadyExist.length > 0
                ? `تم إضافة الصفحات بنجاح. الصفحات التالية موجودة بالفعل: ${pagesAlreadyExist.join(", ")}`
                : "تم إضافة الصفحات بنجاح";

            return response.status(200).json({ message: successMessage });
        }
        catch ( error )
        {
            return response.status(500).json({ message: "حدث خطأ أثناء إضافة الصفحات", error: error.message });
        }
    };

    try
    {
        await addPages( time );
        
    }
    catch ( error )
    {
        return response.status(500).json({ message: "حدث خطأ", error: error.message });
    }
});

export default router;
