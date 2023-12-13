import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default{
  /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
  */
  getLandingPage: async (req,res) => {
    try{
      const landingPageData = await prisma.catalogs.findMany({
        take:4, //mengammbil 4 data
        include: {enterprise: true}
      })

      return res.json(landingPageData)

    }catch(error){
      console.error(error);
      return res.INTERNAL_SERVER_ERROR()
    }
  }
}