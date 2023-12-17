import { PrismaClient } from "@prisma/client";
import yup from "yup";
import validator from "../../helpers/validator.mjs";
const prisma = new PrismaClient();

export default{
  /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
  */

  getCatalogs: async (req,res) => {
    try{
      const catalogData = await prisma.catalogs.findMany({
        select:{
          id: true,
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
          status: true,
          enterprise:{
            select:{
              id: true,
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
              type: true,
            }
          }
        }
      })

      return res.json(catalogData);

    } catch(error){
      console.log(error);
      return res.INTERNAL_SERVER_ERROR()
    }
  },

  getDetailCatalog: async (req,res) => {
    const{id} = req.params

    try{
      const detailCatalogData = await prisma.catalogs.findFirst({
        where:{id},
        include: {enterprise: true},
      })

      if(!detailCatalogData){
        return res.status(404).json({
          mmessage: 'Catalog not found'
        })
      }

      return res.status(200).json(
        detailCatalogData
      )

    } catch(error){
      return res.INTERNAL_SERVER_ERROR()
    }
  },

  editCatalog: async (req,res) => {
    const{categories, name, description,image1Url,image2Url,image3Url,catalogUrl, type, keywords, status, suspendReason } = req.body;
    const{id} = req.params

    try{
      const schema = yup.object({
        categories: yup.string().required(),
        name: yup.string().required(),
        description: yup.string().required(),
        image1Url: yup.string().required(),
        image2Url: yup.string().required(),
        image3Url: yup.string().required(),
        catalogUrl: yup.string().required(),
        type: yup.string().required(),
        keywords: yup.string().required(),
        status: yup.string().oneOf(['show', 'hidden', 'suspend']),
        suspendReason: yup.string().required(),
      })

      const validate = await validator(schema,req.body);

      if(validate.errors){
        return res.status(400).json({
          errors: validate.errors
        })
      }

      const oldCatalogData = await prisma.catalogs.findFirst({
        where:{id},
      })

      if(!oldCatalogData){
        return res.status(404).json({
          message: 'Catalog not found'
        })
      }

      const updateCatalogData = await prisma.catalogs.update({
        where:{id},
        data:{
          categories: categories || oldCatalogData.categories,
          name: name || oldCatalogData.name,
          description: description || oldCatalogData.description,
          image1Url: image1Url || oldCatalogData.image1Url,
          image2Url: image2Url || oldCatalogData.image2Url,
          image3Url: image3Url || oldCatalogData.image3Url,
          catalogUrl: catalogUrl || oldCatalogData.catalogUrl,
          type: type || oldCatalogData.type,
          keywords: keywords || oldCatalogData.keywords,
          status: status || oldCatalogData.status,
          suspendReason: suspendReason || oldCatalogData.suspendReason
        }
      })

      return res.status(200).json({
        message: 'Catalog data have been updated'
      })


    } catch(error){
      return res.INTERNAL_SERVER_ERROR()

    }
  },

  deleteCatalog: async (req,res) => {
    const{id} = req.params
    try{
      const existCtalogData = await prisma.catalogs.findFirst({
        where:{id}
      })
      
      if(!existCtalogData){
        return res.status(404).json({
          message: 'Catalog data not found'
        })
      }

      await prisma.catalogs.delete({
        where:{id}
      })

      return res.status(200).jdon({
        message: 'Catalog data has been deleted'
      })
    } catch(error){
      return res.INTERNAL_SERVER_ERROR()
    }
  }
}