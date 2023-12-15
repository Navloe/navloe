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
 getCatalogs: async (req,res) => {
  try{
    const allCatalogs = await prisma.catalogs.findMany({
      select: {
        id: true,
        enterpriseId: true,
        categories: true,
        name: true,
        uid: true,
        description: true,
        image1Url: true,
        image2Url: true,
        image3Url: true,
        catalogUrl: true,
        type: true,
        keywords: true,
        status: true
      },
    })
    
    return res.json(allCatalogs)

  }catch(error){
    return res.INTERNAL_SERVER_ERROR()
  }

 },
 /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
  */

 getDetailCatalog: async(req,res) => {
  const{id} = req.params

  try{
    const catalog = await prisma.catalogs.findFirst({
      where:{id},
    })

    if(!catalog){
      return res.status(404).json({
        message: 'Catalog not found'
      })
    }

    return res.status(200).json(
      catalog
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

  updateCatalog: async(req,res) => {
    const{categories, name, uid, description,image1Url,image2Url,image3Url,catalogUrl, type, keywords} = req.body;
    const{id} = req.params

    try{
      const oldCatalog = await prisma.catalogs.findFirst({
        where:{id},
      })

      if(!oldCatalog){
        return res.status(404).json({
          message: 'Catalog not found'
        });
      }

      const updateCatalog = await prisma.catalogs.update({
        where:{id},
        data:{
          categories: categories || oldCatalog.categories,
          name: name || oldCatalog.name,
          description: description || oldCatalog.description,
          image1Url: image1Url || oldCatalog.image1Url,
          image2Url: image2Url || oldCatalog.image2Url,
          image3Url: image3Url || oldCatalog.image3Url,
          catalogUrl: catalogUrl || oldCatalog.catalogUrl,
          type: type || oldCatalog.type,
          keywords: keywords || oldCatalog.keywords
        }
      })

      return res.status(200).json({
        message: 'Catalog have been updated'
      })
    }catch(error){
      return res.INTERNAL_SERVER_ERROR()
    }
  },

  createCatalog: async (req,res) => {
    try{
      const schema = yup.object({
        enterpriseId: yup.string().required(),
        categories: yup.string().required(),
        name: yup.string().required(),
        uid: yup.string().required(),
        description: yup.string().required(),
        image1Url: yup.string().required(),
        image2Url: yup.string(),
        image2Url: yup.string(),
        catalogUrl: yup.string().required(),
        type: yup.string().required().oneOf(['product', 'service']),
        keywords: yup.string().required(),
        status: yup.string().required().oneOf(['show', 'hidden','suspend']),
      })

      const validate = await validator(schema, req.body);

      if(validate.errors){
        return res.status(400).json({
          errors: validate.errors
        })
      }
      const{enterpriseId, categories, name, uid, description,image1Url,image2Url,image3Url,catalogUrl, type, keywords, status} = req.body;

      await prisma.catalogs.create({
        data:{
          enterpriseId: enterpriseId,
          categories: categories.toString(),
          name: name,
          uid: uid,
          description: description,
          image1Url: image1Url,
          image2Url: image2Url,
          image3Url: image3Url,
          catalogUrl: catalogUrl,
          keywords: keywords,
          type: type,
          status: status
        }
      })

      return res.status(200).json({
        message: 'Catalog created succesful'
      })
    }catch(error){
      return res.INTERNAL_SERVER_ERROR()
    }
  },

  deleteCatalog: async(req,res) => {
    const{id} = req.params

    try{
      const existCatalog = await prisma.catalogs.findFirst({
        where:{id},
      })

      if(!existCatalog){
        return res.status(404).json({
          message: 'Catalog not found'
        })
      }

      await prisma.catalogs.delete({
        where:{id},
      })

      return res.status(200).json({
        message: 'Catalog has been deleted'
      })

    }catch(error){
      return res.INTERNAL_SERVER_ERROR()
    }
  }

}