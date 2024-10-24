import express from "express";
import { StudentInfo } from "../models/student.js";
const router = express.Router();

router.get( "/:StatisticsType", async ( request, response ) =>
{
    const StatisticsType = request.params.StatisticsType;
    try
    {
        let studentsStatistics = "";
        let title = "";
        if ( StatisticsType === "احصائيات الحضور" )
        {
            studentsStatistics = await StudentInfo.find( {} ).sort( { "daysOfAttendance.attendance.total": -1 } );
            title = "عدد أيام الحضور"
        }

        else if (StatisticsType === "احصائيات التسميع ( جديدة )") {
            studentsStatistics = await StudentInfo.aggregate([
                {
                    $addFields: {
                        newPagesLength: { $size: "$pagesOfRecitation.newPages" }
                    }
                },
                {
                    $sort: { newPagesLength: -1 }
                }
            ]);
        }

        else if (StatisticsType === "احصائيات التسميع ( قديمة )") {
            studentsStatistics = await StudentInfo.aggregate([
                {
                    $addFields: {
                        oldPagesLength: { $size: "$pagesOfRecitation.oldPages" }
                    }
                },
                {
                    $sort: { oldPagesLength: -1 }
                }
            ]);
        }

        response.status( 200 ).json( { data: studentsStatistics } );

    } catch ( error )
    {
        response.status( 500 ).json( { message: "يوجد خطأ في الاتصال الرجاء المحاولة لاحقا" } );
    }
} );

export default router


