// import express from "express";
// import { StudentInfo } from "../models/student.js";
// import { startClient, sendMessage } from "../router/services/WhatsappClient.js"; 
// import multer from "multer"; 

// const upload = multer();
// const router = express.Router();

// router.get( '/', ( req, res ) =>
// {
//   res.send( 'Hello World!' );
// } );

// router.post( "/message", upload.single( "file" ), ( req, res ) =>
// {
//   const file = req.file;
//   const clientId = req.body.clientId;
//   sendMessage( req.body.phoneNumber, req.body.message, clientId, file );
//   res.send();
// } );

// router.get( '/:id/start', ( req, res ) =>
// {
//   startClient( req.params.id );
//   res.send();
// } );

// export default router;
