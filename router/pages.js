import express from "express";
import { StudentInfo } from "../models/student.js";
const router = express.Router();

router.post("/", async (request, response) => {
    const { name, pages, typeOfPages, time } = request.body;

    const autoDate = new Date();
    const fullDate = `${autoDate.getDate()}/${autoDate.getMonth() + 1}`;

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
            const notVailed = [];

            for (let page of pages) {
                const pageInt = parseInt(page, 10);

                if (pageInt) {
                    let exists;

                    if (typeOfPages === "جديدة") {
                        exists = student.pagesOfRecitation.newPages.some(entry => entry.pages === pageInt);

                        if (!exists) {
                            student.pagesOfRecitation.newPages.push({ date: time, pages: pageInt });
                        }
                    } else if (typeOfPages === "مراجعة") {
                        exists = student.pagesOfRecitation.oldPages.some(entry => entry.pages === pageInt);

                        if (!exists) {
                            student.pagesOfRecitation.oldPages.push({ date: time, pages: pageInt });
                        }
                    }

                    if (exists) {
                        pagesAlreadyExist.push(pageInt);
                    }
                } else {
                    notVailed.push(page);
                }
            }

            student.pagesOfRecitation.total += pages.length - pagesAlreadyExist.length - notVailed.length;
            await student.save();

            let successMessage = "";

            if (pagesAlreadyExist.length === pages.length) {
                successMessage = `الصفحات التالية موجودة بالفعل: ${pagesAlreadyExist.join(", ")}`;
                return response.status(200).json({ message: successMessage });
            }
            else if ( pagesAlreadyExist.length > 0 )
            {
                successMessage = `تم إضافة الصفحات بنجاح. الصفحات التالية موجودة بالفعل: ${pagesAlreadyExist.join(", ")}`;
                return response.status(200).json({ message: successMessage });
            }
            else if ( notVailed.length === pages.length )
            {
                successMessage = `يجب تنزيل أرقام الصفحات: ${notVailed.join(", ")}`;
                return response.status(200).json({ message: successMessage });
            }
            else
            {
                successMessage = pagesAlreadyExist.length > 0 && notVailed.length > 0 ?
                    `يجب تنزيل أرقام الصفحات: ${notVailed.join(", ")}, الصفحات التالية موجودة بالفعل: ${pagesAlreadyExist.join(", ")}, تم تنزيل الصفحات المقبولة`
                    : `تم تنزيل الصفحات بنجاح`;
                return response.status(200).json({ message: successMessage });
            }
        }
        catch ( error )
        {
            return response.status(500).json({ message: "حدث خطأ أثناء إضافة الصفحات", error: error.message });
        }
    };

    try {
        await addPages(time);
    } catch (error) {
        return response.status(500).json({ message: "حدث خطأ", error: error.message });
    }
});

export default router;
