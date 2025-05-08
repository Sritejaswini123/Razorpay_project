import factory from "../factory.js";
import { createUserHandlers , getUserByIdHandlers, getAllUsersHandlers,deleteUserByIdHandlers } from "../handlers/user-handler.js";


const userRoutes = factory.createApp();
userRoutes.post('/users',...createUserHandlers);
userRoutes.get('/user/:user_id',...getUserByIdHandlers);
userRoutes.get('/users', ...getAllUsersHandlers);
userRoutes.delete('/user/:user_id',...deleteUserByIdHandlers);

export default userRoutes;

