import yup from "yup";
import validator from "../../helpers/validator.mjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default {
  /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
   */
  get: async (req, res) => {
    try {
      const page = parseInt(req.query.page ?? 1 );
      const limitPerPage = parseInt(req.query.limit ?? 10 );
      const searchKeyword = req.query.searchKeyword ?? null;

      const allUsers = await prisma.users.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          emailVerified: true,
          role: true,
          createdAt: true,
        },
        where: {
          OR: [
              { name: { contains: searchKeyword ?? '' } },
              { email: { contains: searchKeyword ?? '' } },
              { phoneNumber: { contains: searchKeyword ?? '' } }
          ].filter(Boolean),
        },
      })

      const totalPage = Math.ceil(allUsers.length / limitPerPage);

      if (allUsers.length > 0 && page > totalPage) {
        return res.status(404).json({ 
          message: "Page numbering out of bounds" 
        })
      }

      const paginatedUsers = await prisma.users.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          emailVerified: true,
          role: true,
          createdAt: true,
        },
        where: {
          OR: [
            { name: { contains: searchKeyword ?? '' } },
            { email: { contains: searchKeyword ?? '' } },
            { phoneNumber: { contains: searchKeyword ?? '' } }
          ].filter(Boolean),
        },
        skip: limitPerPage * (page - 1),
        take: limitPerPage,
      })

      return res.json({
        data: paginatedUsers,
        pagination: {
          currentPage: page,
          limitPerPage,
          totalPage,
          displayedData: paginatedUsers.length,
          totalData: allUsers.length,
        }
      });
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