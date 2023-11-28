import { Router } from "express"
import auth from "./controller/auth.mjs";
import umkmMiddleware from "./middleware/umkm.middleware.mjs";
import adminMiddleware from "./middleware/admin.middleware.mjs";
import users from "./controller/admin/users.mjs";
import categories from "./controller/admin/categories.mjs";

const router = Router()

router.post('/auth/login', auth.login);
router.post('/auth/register', auth.register);

router.get('/admin/users', adminMiddleware, users.get);

router.get('/admin/categories', categories.get);
router.post('/admin/categories', categories.post);
router.get('/admin/categories/:id', categories.getById);
router.put('/admin/categories/:id', categories.put);

export default router;