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

  getReportType: async (req,res) => {
    try{
      const allReportType = await prisma.reportTypes.findMany({
        select:{
          id:true,
          reportType: true
        }
      })
      return res.json(allReportType)

    } catch(error){
      console.error(error);
      return res.INTERNAL_SERVER_ERROR()
    }
  },

  getDetailReportType: async (req,res) => {
    const{id} = req.params

    try{
      const detailReportType = await prisma.reportTypes.findFirst({
        where:{id}
      })

      if(!detailReportType){
        return res.status(404).json({
          message:'Report type not found'
        })
      }
      
    } catch(error){
      return res.INTERNAL_SERVER_ERROR()
    }
  },

  updateReportType: async(req,res) => {
    const{reportType} = req.body;
    const{id} = req.params

    try{
      const oldReportType = await prisma.reportTypes.findFirst({
        where:{id},
      })

      if(!oldReportType){
        return res.status(404).json({
          message:'Report type not found'
        })
      }
      const updateReportType = await prisma.reportTypes.update({
        where:{id},
        data:{
          reportType: reportType || oldReportType.reportType
        }
      })

      return res.status(200).json({
        message: 'Report type have been updated'
      })
    } catch(error){
      return res.INTERNAL_SERVER_ERROR()
    }
  },

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
      return res.INTERNAL_SERVER_ERROR()
    }
    
  },

  deleteReportType: async(req,res) => {
    const{id} = req.params

    try{
      const existReportType = await prisma.reportTypes.findFirst({
        where:{id}
      })

      if(!existReportType){
        return res.status(400).json({
          message:'Report type not found'
        })
      }

      await prisma.reportTypes.delete({
        where:{id}
      })

      return res.status(200).json({
        message:'Report type has been deleted'
      })

    } catch(error){
      return res.INTERNAL_SERVER_ERROR()
    }
  }


}