import yup from "yup";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
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
      
      const status = req.query.status ?? 'show'
      const page = parseInt(req.query.page ?? 1 )
      const limitPerPage = parseInt(req.query.limit ?? 10 )
      const searchKeyword = req.query.searchKeyword ?? null

      const catalogStatistic = await prisma.catalogs.groupBy({
        by: ['status'],
        _count: {
          status: true,
          _all: true, // This includes the counts for all statuses, even those with a count of 0
        },
        where: {
          enterpriseId: enterprise.id,
        }
      })

      const allCatalogs = await prisma.catalogs.findMany({
        where: {
          AND:[
            { enterpriseId: enterprise.id },
            { status },
          ],
          OR: [
            { name: {contains: searchKeyword ?? ""} },
            { description: {contains: searchKeyword ?? ""} },
            { keywords: {contains: searchKeyword ?? ""} },
          ]
        }
      })

      const totalPage = Math.ceil(allCatalogs.length / limitPerPage);

      if (allCatalogs.length > 0 && page > totalPage) {
        return res.status(404).json({ 
          message: "Page numbering out of bounds" 
        })
      }

      const paginatedCatalogs = await prisma.catalogs.findMany({
        where: {
          AND:[
            { enterpriseId: enterprise.id },
            { status },
          ],
          OR: [
            { name: {contains: searchKeyword ?? ""} },
            { description: {contains: searchKeyword ?? ""} },
            { keywords: {contains: searchKeyword ?? ""} },
          ]
        },
        skip: limitPerPage * (page - 1),
        take: limitPerPage,
      })

      return res.json({
        data: paginatedCatalogs,
        pagination: {
          currentPage: page,
          limitPerPage,
          totalPage,
          displayedData: paginatedCatalogs.length,
          totalData: allCatalogs.length,
        },
        catalogStatistic
      })

    }catch(error){
      console.log(error);
      return res.INTERNAL_SERVER_ERROR()
    }

  },
  /**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
    */
  getDetailCatalog: async(req,res) => {
    const token = req.headers.authorization.split(' ')[1];
    const{id} = req.params

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
      const catalog = await prisma.catalogs.findFirst({
        where:{
          AND:[
            {id},
            {enterpriseId: enterprise.id}
          ]
        },
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
  updateCatalogOld: async(req,res) => {
    const{categories, name, uid, description,image1Url,image2Url,image3Url,catalogUrl, type, keywords,status } = req.body;
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
  /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
  */
  updateCatalog: async (req,res) => {
    
    const schema = yup.object({
      categories: yup.string().required(),
      name: yup.string().required(),
      description: yup.string().required(),
      catalogUrl: yup.string().required(),
      type: yup.string().required().oneOf(['product', 'service']),
      keywords: yup.string().required(),
      status: yup.string().required().oneOf(['show', 'hidden']),
    })

    const validate = await validator(schema, req.body);

    if(validate.errors){
      return res.status(400).json({
        errors: validate.errors
      })
    }

    try{
      const token = req.headers.authorization.split(' ')[1];
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

      let image1Url = null
      let image2Url = null
      let image3Url = null

      if(req.files){
        for (let i = 0; i < req.files.length; i++) {
          if (req.files[i].fieldname == `image${i+1}Url`) {
            const base64String = req.files[i].buffer.toString('base64');
            const result = await cloudinary.uploader.upload(`data:image/png;base64,${base64String}`, {
              folder: "catalogImages",
              public_id: req.files[i].filename + userId
            });
            if (i == 0)
              image1Url = result.secure_url;
            else if (i == 1)
              image2Url = result.secure_url;
            else if (i == 2)
              image3Url = result.secure_url;
          }
        }
      }

      const id = req.params.id

      const oldCatalog = await prisma.catalogs.findFirst({
        where:{id},
      })

      if(!oldCatalog){
        return res.status(404).json({
          message: 'Catalog not found'
        });
      }

      const{categories, name, description, catalogUrl, type, keywords, status} = req.body;

      await prisma.catalogs.update({
        data:{
          categories: categories.toString() || oldCatalog.categories,
          name: name || oldCatalog.name,
          description: description || oldCatalog.description,
          image1Url: image1Url || oldCatalog.image1Url,
          image2Url: image2Url || oldCatalog.image2Url,
          image3Url: image3Url || oldCatalog.image3Url,
          catalogUrl: catalogUrl || oldCatalog.catalogUrl,
          keywords: keywords || oldCatalog.keywords,
          type: type || oldCatalog.type,
          status: status || oldCatalog.status
        },
        where: {id}
      })

      return res.status(200).json({
        message: 'Catalog updated succesful'
      })
    }catch(error){
      console.log(error);
      return res.INTERNAL_SERVER_ERROR()
    }
  },
  /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
  */
  createCatalog: async (req,res) => {
    
    const schema = yup.object({
      categories: yup.string().required(),
      name: yup.string().required(),
      description: yup.string().required(),
      catalogUrl: yup.string().required(),
      type: yup.string().required().oneOf(['product', 'service']),
      keywords: yup.string().required(),
    })

    const validate = await validator(schema, req.body);

    if(validate.errors){
      return res.status(400).json({
        errors: validate.errors
      })
    }

    try{
      const token = req.headers.authorization.split(' ')[1];
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

      let image1Url = null
      let image2Url = null
      let image3Url = null

      for (let i = 0; i < req.files.length; i++) {
        if (req.files[i].fieldname == `image${i+1}Url`) {
          const base64String = req.files[i].buffer.toString('base64');
          const result = await cloudinary.uploader.upload(`data:image/png;base64,${base64String}`, {
            folder: "catalogImages",
            public_id: req.files[i].filename + userId
          });
          if (i == 0)
            image1Url = result.secure_url;
          else if (i == 1)
            image2Url = result.secure_url;
          else if (i == 2)
            image3Url = result.secure_url;
        }
      }

      const{categories, name, description, catalogUrl, type, keywords} = req.body;

      const alphabet = "abcdefghjkmnpqrstwxyz"
      const randomString = "" + alphabet[Math.floor(Math.random() * 21)] + Math.floor(Math.random() * 21) + Math.floor(Math.random() * 21)
      const catalogUid = name.toLowerCase().replaceAll(" ", "-") + randomString


      await prisma.catalogs.create({
        data:{
          enterpriseId: enterprise.id,
          categories: categories.toString(),
          name: name,
          uid: catalogUid,
          description: description,
          image1Url: image1Url,
          image2Url: image2Url,
          image3Url: image3Url,
          catalogUrl: catalogUrl,
          keywords: keywords,
          type: type,
          status: 'show'
        }
      })

      return res.status(200).json({
        message: 'Catalog created succesful'
      })
    }catch(error){
      console.log(error);
      return res.INTERNAL_SERVER_ERROR()
    }
  },
  /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
  */
  deleteCatalog: async(req,res) => {
    const token = req.headers.authorization.split(' ')[1];
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

    const{id} = req.params

    try{
      const existCatalog = await prisma.catalogs.findFirst({
        where:{
          AND:[
            { id },
            { enterpriseId: enterprise.id }
          ]
        },
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
      console.log(error);
      return res.INTERNAL_SERVER_ERROR()
    }
  }

}