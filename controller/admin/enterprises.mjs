import yup from "yup";
import { PrismaClient } from "@prisma/client";
import validator from "../../helpers/validator.mjs";
const prisma = new PrismaClient();

export default{
  /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
  */

  getEnterprises: async (req,res) => {
    try{
      // const enterprises = await prisma.enterprises.findMany({
      //   include: {user : true},
      // })

      const enterprises = await prisma.enterprises.findMany({
        // include: {
        //   user: {
        //     select: {
        //       name: true,
        //       email: true,
        //       phoneNumber: true,
        //       emailVerified: true
        //     }
        //   }
        // },
        select: {
          nib: true,
          name: true,
          uid: true,
          categories: true,
          keywords: true,
          description: true,
          shortDescription: true,
          logoUrl: true,
          storeUrl: true,
          status: true,
          inactiveReason: true,
          user: true // Menambahkan relasi user
        }
      });
      // console.log(error);

      return res.json(enterprises)
      // return res.json(user)
    }catch(error){
      return res.INTERNAL_SERVER_ERROR()
    }
  },

  /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
  */

  getDetailEnterprise: async(req,res) => {
    const{id} = req.params

    try{
      const enterprise = await prisma.enterprises.findFirst({
        where:{id},
        include: {user : true},
      })

      if(!enterprise){
        return res.status(404).json({
          message: 'Enterprise not found'
        })
      }

      return res.status(200).json(
        enterprise
      )
    }catch(error){
      return res.INTERNAL_SERVER_ERROR()
    }
  },
  /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
  */
  updateEnterprise: async (req,res) => {
    const{nib, name, type, categories, keywords, description, shortDescription, logoUrl, storeUrl, status} = req.body;
    const{id} = req.params

    try {
      const oldEnterprise = await prisma.enterprises.findFirst({
        where:{id},
      });

      if(!oldEnterprise){
        return res.status(404).json({
          message: 'Enterprise not found'
        })
      }
      const updatedEnterprise = await prisma.enterprises.update({
        where:{id},
        data:{
          name: name || oldEnterprise.name,
          type: type || oldEnterprise.type,
          categories: categories || oldEnterprise.categories,
          keywords: keywords || oldEnterprise.keywords,
          description: description || oldEnterprise.description,
          shortDescription: shortDescription || oldEnterprise.shortDescription,
          logoUrl: logoUrl  || oldEnterprise.logoUrl,
          storeUrl: storeUrl || oldEnterprise.storeUrl,
          status: status || oldEnterprise.status
        }
      })

      return res.status(200).json({
        message: 'Enterprise have been updated'
      })
    }catch(error){
      return res.INTERNAL_SERVER_ERROR()
    }
  },

  deleteEnterprise: async (req,res) => {
    const{id} = req.params

    try{
      const existEnterprise = await prisma.enterprises.findFirst({
        where:{id}
      })

      if(!existEnterprise){
        return res.status(404).json({
          message: 'Enterprise tidak ditemukan'
        })
      }
      await prisma.enterprises.delete({
        where:{id}
      })

      return res.status(200).json({
        message:'Enterprise has been deleted'
      })
    }catch(error){
      return res.INTERNAL_SERVER_ERROR()
    }
  }

}