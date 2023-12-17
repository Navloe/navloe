import yup from "yup";
import validator from "../../helpers/validator.mjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default{
  /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
  */

  adminGetReport: async (req,res) => {
    try{
      const reports = await prisma.reports.findMany({
        select:{
          Enterprise : true,
          Catalog: true,
          reportType: true
        }
      })
      return res.json(reports)
    }catch(error){

      return res.INTERNAL_SERVER_ERROR()
    }
  },


  adminEditReport: async (req,res) => {
    const {message, status} = req.body;
    const{id} = req.params;

    try{
      const schema = yup.object({
        message: yup.string().required(),
        status: yup.string().oneOf(['pending', 'solved', 'rejected']),
      });

      const validate = await validator(schema, req.body);
      
      if (validate.errors) {
        return res.status(400).json({
          errors: validate.errors,
        });
      }

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
      return res.INTERNAL_SERVER_ERROR()
    }
  },

  adminDeleteReport: async (req,res) => {
    const{id} = req.params

    try{
      const existReport = await prisma.reports.findFirst({
        where:{id}
      })
      if(!existReport){
        return res.status(404).json({
          message: 'Report not found'
        })
      }

      await prisma.reports.delete({
        where:{id}
      })

      return res.status(200).json({
        message: 'Report has been deleted'
      })

    } catch(error){
      return res.INTERNAL_SERVER_ERROR()
    }
  }
}