import yup from "yup";
import validator from "../../helpers/validator.mjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";
import cloudinary from '../../config/cloudinaryConfig.mjs';

export default{

  /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
  */
  getEnterprise: async(req,res) => {
    const token = req.headers.authorization.split(' ')[1];
    
    try{
      let userId = null;
      jwt.verify(token, process.env.JWT_UMKM_SECRET, async function(err, decodedToken) {
        if(!err)
          userId = decodedToken.id
        else
          throw "Token Error";
      })
      const enterprise = await prisma.enterprises.findFirst({
        where: {user: {id: userId}}
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
    const token = req.headers.authorization.split(' ')[1];
    
    try{
      let userId = null;
      jwt.verify(token, process.env.JWT_UMKM_SECRET, async function(err, decodedToken) {
        if(!err)
          userId = decodedToken.id
        else
          throw "Token Error";
      })
      const enterprise = await prisma.enterprises.findFirst({
        where: {user: {id: userId}}
      })

      if(!enterprise){
        return res.status(404).json({
          error: 'UMKM tidak ditemukan'
        })
      }

      let logoUrl = null
      if (req.file) {
        const base64String = req.file.buffer.toString('base64');
        const result = await cloudinary.uploader.upload(`data:image/png;base64,${base64String}`, {
          folder: "enterprisesLogo",
          public_id: req.file.filename
        });
        logoUrl = result.secure_url;
      }

      const{type, categories, keywords, description, shortDescription, storeUrl} = req.body;

      const oldEnterprise = enterprise

      await prisma.enterprises.update({
        where:{ id: oldEnterprise.id},
        data:{
          logoUrl: logoUrl  || oldEnterprise.logoUrl,
          type: type || oldEnterprise.type,
          shortDescription: shortDescription || oldEnterprise.shortDescription,
          description: description || oldEnterprise.description,
          categories: categories || oldEnterprise.categories,
          keywords: keywords || oldEnterprise.keywords,
          storeUrl: storeUrl || oldEnterprise.storeUrl,
        }
      })

      return res.status(200).json({
        message: 'UMKM telah diperbaharui'
      })
    }catch(error){
      return res.INTERNAL_SERVER_ERROR()
    }
  },
}