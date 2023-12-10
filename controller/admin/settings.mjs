import yup from "yup";
import { PrismaClient } from "@prisma/client";
import validator from "../../helpers/validator.mjs";
// import { CategoriesType } from "@prisma/client";
const prisma = new PrismaClient();

export default{
  /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
  */

  getSettings: async (req,res) => {
    try{
      const allSettings = await prisma.settings.findMany({
        select:{
          id: true,
          name: true,
          value: true
        }
      })
      return res.json(allSettings)
    }catch(error){
      return res.INTERNAL_SERVER_ERROR()
    }
  },

  getDetailSetting: async(req,res) => {
    const{id} = req.params
    try{
      const setting = await prisma.settings.findFirst({
        where:{id}
      })
      if(!!!setting){
        return res.status(404).json({
          message: 'Setting not found'
        })
      }
      return res.status(200).json(
        setting
      )
    }catch(error){
      return res.INTERNAL_SERVER_ERROR()
    }
  },

  // putSetting: async (req,res) => {
  //   try{
  //     const schema
  //   }
  // }
}