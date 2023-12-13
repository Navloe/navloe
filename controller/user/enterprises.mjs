import yup from "yup";
import validator from "../../helpers/validator.mjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";

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
          error: 'Enterprise not found'
        })
      }

      const{nib, name, type, categories, keywords, description, shortDescription, logoUrl, storeUrl, status, inactiveReason} = req.body;

      const oldEnterprise = enterprise

      await prisma.enterprises.update({
        where:{ id: oldEnterprise.id},
        data:{
          nib: nib || oldEnterprise.nib,
          name: name || oldEnterprise.name,
          type: type || oldEnterprise.type,
          categories: categories || oldEnterprise.categories,
          keywords: keywords || oldEnterprise.keywords,
          description: description || oldEnterprise.description,
          shortDescription: shortDescription || oldEnterprise.shortDescription,
          logoUrl: logoUrl  || oldEnterprise.logoUrl,
          storeUrl: storeUrl || oldEnterprise.storeUrl,
          status: status || oldEnterprise.status,
          inactiveReason: inactiveReason || oldEnterprise.inactiveReason,
        }
      })

      return res.status(200).json({
        message: 'Enterprise have been updated'
      })
    }catch(error){
      return res.INTERNAL_SERVER_ERROR()
    }
  },
}