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

  createReportType: async (req,res) => {
    try{
      const{reportType} = req.body;

      await prisma.reportTypes.create({
        data:{
          reportType:reportType
        }
      })
      return res.status(200).json({
        message: "Report created successful"
      });

    }catch(error){
      console.log(error);
      return res.INTERNAL_SERVER_ERORR()
    }
    
  },

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
          ipAddress: ipAddress,
          status: status
        }
      })

      return res.status(200).json({
        message: "Report created successful"
      });

    }catch(error){
      console.error(error);
      return res.INTERNAL_SERVER_ERORR()
    }
  },

  adminGetReport: async (req,res) => {
    try{
      const reports = await prisma.reports.findMany({
        include:{
          Enterprise : true,
          Catalog: true,
          reportType: true
        }
      })
      return res.json(reports)
    }catch(error){
      return res.INTERNAL_SERVER_ERORR()
    }
  },


  adminEditReport: async (req,res) => {
    const {message, status} = req.body;
    const{id} = req.params;

    try{
      const oldReport = await prisma.reports.findFirst({
        where:{id},
      });

      if(!oldReport){
        return res.status(404).json({
          message:'Report not found'
        })
      }

      const updateReport = await prisma.reports.update({
        where:{id},
        data:{
          message: message || oldReport.message,
          status: status || oldReport.status
        }
      });

      return res.status(200).json({
        message:'Report have been updated'
      })
    }catch(error){
      return res.INTERNAL_SERVER_ERORR()
    }
  }
}