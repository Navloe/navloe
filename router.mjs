import { Router } from "express"
import auth from "./controller/auth.mjs";
import umkmMiddleware from "./middleware/umkm.middleware.mjs";
import adminMiddleware from "./middleware/admin.middleware.mjs";
import users from "./controller/admin/users.mjs";
import categories from "./controller/admin/categories.mjs";

const router = Router()

router.post('/auth/login', auth.login);
router.post('/auth/register', auth.register);
router.get('/auth/whoami', auth.whoami);

router.get('/admin/users', adminMiddleware, users.get);

router.get('/admin/categories', categories.get);
router.get('/admin/category/:id', categories.detail);
router.post('/admin/category', categories.create);
router.put('/admin/category/:id', categories.update);
router.delete('/admin/category/:id', categories.delete);

export default router;