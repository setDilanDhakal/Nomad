import {Router} from 'express';
import {Register, Login, UpdateUser, getUserById} from '../controllers/user.js'
import { upload } from '../middlewares/multer.js'

const userRoute = Router();


userRoute.route('/register').post(Register);
userRoute.route('/login').post(Login);
userRoute.route('/:id').put(upload.single('image'), UpdateUser);
userRoute.route('/:id').get(getUserById);



export default userRoute;



