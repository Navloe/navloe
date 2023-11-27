import { Router } from "express"
import auth from "./controller/auth.mjs";
import umkmMiddleware from "./middleware/umkm.middleware.mjs";
import adminMiddleware from "./middleware/admin.middleware.mjs";
import users from "./controller/admin/users.mjs";

const router = Router()

router.post('/auth/login', auth.login);
router.post('/auth/register', auth.register);

router.get('/admin/users', adminMiddleware, users.get);

export default router;