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
  
  getUserSetting: async (req,res) => {
    const { id } = req.params
    try{
      const userData = await prisma.users.findFirst({
        where: {id},
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          phoneNumber: true
        },
      })

      if (!userData){
        return res.status(404).json({ 
          message: 'User data not found' 
        });
      }

      return res.status(200).json(
        userData
      )

    }catch(error){ 
      return res.INTERNAL_SERVER_ERROR()
    }
  },


  editUserSetting: async (req,res) => {
    const {name, email, phoneNumber} = req.body;
    const{id} = req.params

    try{
      const oldUserData = await prisma.users.findFirst({
        where: {id},
      });

      if (!oldUserData) {
        return res.status(404).json({ 
          message: 'User data not found' 
        });
      }

      const updatedUserData = await prisma.users.update({
        where:{id},
        data:{
          name: name || oldUserData.name,
          email: email || oldUserData.email,
          phoneNumber: phoneNumber || oldUserData.phoneNumber
        }
      })

      return res.status(200).json({
        message: 'User data have been updated'
      })

    } catch(error){
      return res.INTERNAL_SERVER_ERROR()
    }
  }
}