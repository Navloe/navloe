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

  postSetting: async (req,res) => {
    try{
      const schema = yup.object({
        name: yup.string().required(),
        value: yup.string().required(),
      })
      const validate = await validator(schema, req.body);

      if(validate.errors){
        return res.status(400).json({
          errors: validate.errors,
        })
      }

      const{name, value} = req.body;

      await prisma.settings.create({
        data:{
          name,
          value
        }
      })

      return res.status(200).json({
        message: 'Setting created succesfuly'
      })
    }catch(error){
      console.error(error);
      return res.INTERNAL_SERVER_ERROR()
    }
  },

  editSetting: async (req,res) => {
    const{name, value} = req.body;
    const{id} = req.params

    try{
      const schema = yup.object({
        name: yup.string().required(),
        value: yup.string().required()
      });

      const validate = await validator(schema, req.body);

      if (validate.errors) {
        return res.status(400).json({
          errors: validate.errors,
        });
      }

      const oldSetting = await prisma.settings.findFirst({
        where:{id}
      })

      if(!oldSetting){
        return res.status(404).json({
          message: 'Setting not found'
        })
      }

      const updatedSetting = await prisma.settings.update({
        where:{id},
        data:{
          name: name || oldSetting.name,
          value: value || oldSetting.value
        }
      })

      return res.status(200).json({
        message:'Setting have been updated'
      })
    }catch(error){
      return res.INTERNAL_SERVER_ERROR()
    }
  },

  deleteSetting: async (req,res) => {
    const{id} = req.params

    try{
      const existSetting = await prisma.settings.findFirst({
        where:{id}
      })

      if(!existSetting){
        return res.status(404).json({
          message: 'Setting not found'
        })
      }

      await prisma.settings.delete({
        where:{id}
      })

      return res.status(200).json({
        message: 'Setting has been deleted'
      })
    }catch(error){
      return res.INTERNAL_SERVER_ERROR()
    }
  }
}