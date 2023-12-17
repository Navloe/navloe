// import yup from "yup";
import { PrismaClient } from "@prisma/client";
import { request } from "express";
// import validator from "../helpers/validator.mjs";
const prisma = new PrismaClient();

export default{
  /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
  */

  createReport: async (req,res) => {
    try{
      const{enterpriseId,catalogId,reportTypeId,   message, ipAddress, status} = req.body;

      // mengambil ip address pengguna
      const ip = 
        request.headers['cf-connecting-ip'] ||
        request.headers['x-real-ip'] ||
        request.headers['x-forwarder-for'] ||
        request.socket.remoteAddress || '';

      await prisma.reports.create({
        data:{
          enterpriseId: enterpriseId,
          catalogId: catalogId,
          reportTypeId: reportTypeId,
          message: message,
          ipAddress: ip,
          status: status
        }
      })

      return res.status(200).json({
        message: "Report created successful"
      });

    }catch(error){
      console.error(error);
      return res.INTERNAL_SERVER_ERROR()
    }
  }

}
