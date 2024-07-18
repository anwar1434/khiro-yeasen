import { mongoDB } from "./config.js";
import express from "express";
import mongoose from "mongoose"; 
import cors from "cors";
// Import router
import studentDetils from "./router/studentDetils.js";
import studentClass from "./router/studentClass.js";
import pages from "./router/pages.js";
import attendance from "./router/attendance.js"
import seting from "./router/seting.js"
import infoeMinse from './router/infoeMinse.js'

const app = express();
const port = 5555;

app.use(cors())
app.use( express.json() );

app.use("/students", studentDetils);
app.use("/studentClass", studentClass);
app.use("/pages", pages);
app.use("/attendance", attendance);
app.use( "/seting", seting );
app.use( "/infoeMinse", infoeMinse );



mongoose.connect(mongoDB)
    .then(() => {
        app.listen(port, () => {
            console.log(`App is listening on port ${port}`); 
            console.log("Connection is successful"); 
        });
    })
    .catch((error) => {
        console.log(`We have an error: ${error}`); // استخدام علامات الاقتباس العادية بدلاً من الأقواس
    });
