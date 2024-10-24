import { mongoDB } from "./config.js";
import express from "express";
import mongoose from "mongoose"; 
import cors from "cors";
// Import student router
import date from "./router/date.js"
import pages from "./router/pages.js";
import seting from "./router/seting.js"
import attendance from "./router/attendance.js"
import studentClass from "./router/studentClass.js";
import studentDetils from "./router/studentDetils.js";
// import messageRoute from "./router/messageRouter.js"
import classManagement from "./router/classManagement.js"
import studentMangement from "./router/studentMangement.js"
import subjects from "./router/subjects.js"
// import WhatsappClient from "./router/services/WhatsappClient.js"
// Import date router



const app = express();
const port = 5555;
app.use(cors())
app.use( express.json() );

app.use( "/date", date );
app.use("/pages", pages);
app.use( "/seting", seting );
app.use( "/attendance", attendance );
app.use( "/students", studentDetils );
app.use("/studentClass", studentClass);
// app.use( "/messageRoute", messageRoute );
app.use( "/classManagement", classManagement );
app.use( "/studentMangement", studentMangement );
app.use( "/subjects", subjects );

mongoose.connect(mongoDB)
    .then(() => {
        app.listen(port, () => {
            console.log(`App is listening on port ${port}`); 
            console.log("Connection is successful"); 
        });
    })
    .catch((error) => {
        console.log(`We have an error: ${error}`); 
    });
