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

  getEnterprises: async (req,res) => {
    try{
      const status = req.query.status ?? ''
      const type = req.query.type ?? []
      const page = parseInt(req.query.page ?? 1 )
      const limitPerPage = parseInt(req.query.limit ?? 10 )
      const searchKeyword = req.query.searchKeyword ?? null

      const allStatus = status.split(',');

      const allEnterprises = await prisma.enterprises.findMany({
        select: {
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
          inactiveReason: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true
            }
          }
        },
        where: {
          OR:[
            // ...allStatus,
            { nib: { contains: searchKeyword ?? '' } },
            { name: { contains: searchKeyword ?? '' } },
            { description: { contains: searchKeyword ?? '' } },
            { shortDescription: { contains: searchKeyword ?? '' } },
            { user: { name: { contains: searchKeyword ?? '' } } },
          ],
          AND: [
            !!status ? { status: { in: allStatus } } : { status: { in: ["active", "inactive", "pending", "rejected"] } },
            { type: type.length > 0 ? { equals: type } : { in: ["product", "service", "both"] }},
          ]
        }
        
      });

      const totalPage = Math.ceil(allEnterprises.length / limitPerPage);

      if (allEnterprises.length > 0 && page > totalPage) {
        return res.status(404).json({ 
          message: "Page numbering out of bounds" 
        })
      }
      
      const paginatedEnterprises = await prisma.enterprises.findMany({
        select: {
          id: true,
          nib: true,
          name: true,
          uid: true,
          userId: true,
          categories: true,
          keywords: true,
          description: true,
          shortDescription: true,
          logoUrl: true,
          storeUrl: true,
          status: true,
          type: true,
          inactiveReason: true,
          updatedAt: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true
            }
          }
        },
        where: {
          OR:[
            // ...allStatus,
            { nib: { contains: searchKeyword ?? '' } },
            { name: { contains: searchKeyword ?? '' } },
            { description: { contains: searchKeyword ?? '' } },
            { shortDescription: { contains: searchKeyword ?? '' } },
            { user: { name: { contains: searchKeyword ?? '' } } },
          ],
          AND: [
            !!status ? { status: { in: allStatus } } : { status: { in: ["active", "inactive", "pending"] } },
            { type: type.length > 0 ? { equals: type } : { in: ["product", "service", "both"] }},
          ]
        },
        skip: limitPerPage * (page - 1),
        take: limitPerPage,
        
      });

      return res.json({
        data: paginatedEnterprises,
        pagination: {
          currentPage: page,
          limitPerPage,
          totalPage,
          displayedData: paginatedEnterprises.length,
          totalData: allEnterprises.length,
        },
      });
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
    const{nib, name, type, categories, keywords, description, shortDescription, logoUrl, storeUrl, status, inactiveReason} = req.body;
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
      await prisma.enterprises.update({
        where:{id},
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