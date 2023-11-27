import jwt from "jsonwebtoken";
/**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
   * @param {import('express').NextFunction} next
   */
export default async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw 'Token kosong!'
    }
    const authorization = req.headers.authorization.split(' ');
    
    if (authorization[0].toLowerCase() != 'bearer') {
      throw 'Format token salah!'
    }
    if (!authorization[1]) {
      throw 'Token invalid!'
    }

    const verify = await jwt.verify(authorization[1], process.env.JWT_UMKM_SECRET);

    if (verify.role != 'admin') {
      console.log(verify);
      throw 'Akses ditolak!'
    }

    req.user = {
      id: verify.id,
    }

    return next()
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      error: 'Terjadi kesalahan saat autentikasi!'
    })
  }
}