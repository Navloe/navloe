import yup from "yup";
import validator from "../../helpers/validator.mjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default {
  get: async (req, res) => {
    try {
      const users = await prisma.users.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          emailVerified: true,
          role: true,
          createdAt: true,
        }
      })

      return res.json(users)
    } catch (error) {
      console.error(error);
      return res.INTERNAL_SERVER_ERROR()
    }
  
  },
  /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
   */
  detailUser: async (req,res) => {
    const{id} = req.params

    try{
      const user = await prisma.users.findFirst({
        where: {id},
      });
      
      if(!user){
        return res.status(404).json({ 
        message: 'Category not found' 
        });
      }

      return res.status(200).json(
        user
      );
    }catch(error){
      return res.INTERNAL_SERVER_ERROR();
    }
  },

  /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
  */
  updateUser: async(req,res) => {
    const{name, email, phoneNumber} = req.body;
    const{id} = req.params

    try{
      const oldUser = await prisma.users.findFirst({
        where:{id},
      });

      if(!oldUser){
        return res.status(404).json({
          message: 'User not found'
        });
      }

      const updatedUser = await prisma.users.update({
        where:{id},
        data:{
          name: name || oldUser.name,
          email: email || oldUser.email,
          phoneNumber: phoneNumber || oldUser.phoneNumber,
        },
      });

      return res.status(200).json({
        message: 'User have been updated'
      });

    }catch (error){
        return res.INTERNAL_SERVER_ERROR() 
    }
  },

  deleteUser: async (req,res) => {
    const {id} = req.params

    try{
      const existUser = await prisma.users.findFirst({
        where:{id},
      });

      if(!existUser){
        return res.status(404).json({
          message: 'User not found'
        });
      }

      await prisma.users.delete({
        where:{id}
      })

      return res.status(200).json({
        message: 'User has been deleted'
      })

    }catch (error){
      return res.INTERNAL_SERVER_ERROR()
    }
  }

}