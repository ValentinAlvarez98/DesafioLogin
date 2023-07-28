import {
      Router
} from 'express';

import UsersManager from '../dao/dbManagers/users.js';

import {
      handleTryErrorDB,
      validateData,
      validateFields,
      phoneOptions
} from '../helpers/handleErrors.js';
import {
      cfgSession,
      isAdmin
} from '../helpers/handleSessions.js';
const usersManager = new UsersManager();

const sessionsRouter = Router();

sessionsRouter.post('/login', async (req, res) => {

      try {

            const {
                  email,
                  password
            } = req.body;

            const isValid = validateFields(req.body, ['email', 'password']);

            validateData(!isValid, res, "Faltan campos obligatorios");

            const user = await usersManager.loginUser(req.body);

            validateData(!user, res, "Error en el usuario o contraseña");

            cfgSession(user, req, res);


      } catch (error) {

            handleTryErrorDB(error);

      };

});

sessionsRouter.post('/register', async (req, res) => {

      try {

            const {
                  first_name,
                  last_name,
                  email,
                  password,
                  confirmed_password
            } = req.body;

            const isValid = validateFields(req.body, ['first_name', 'last_name', 'email', 'password', 'confirmed_password']);

            validateData(!isValid, res, "Faltan campos obligatorios");

            validateData(password !== confirmed_password, res, "Las contraseñas ingresadas, no coinciden");

            const newUser = {
                  first_name,
                  last_name,
                  email,
                  password,
            };

            const result = await usersManager.registerUser(newUser);

            validateData(!result, res, "El usuario ya está registrado");

            res.send({
                  status: "success",
                  payload: `El usuario ${newUser.first_name} ${newUser.last_name} se ha creado correctamente`
            });

      } catch (error) {

            handleTryErrorDB(error);

      };

});

sessionsRouter.post('/logout', async (req, res) => {

      try {

            res.clearCookie('userData');
            req.session.destroy((err) => {
                  if (err) {
                        console.log(err);
                  };
            });

            res.redirect('/login');

      } catch (error) {

            handleTryErrorDB(error);

      };

});

sessionsRouter.post('/profile', async (req, res) => {

      try {
            const {
                  first_name,
                  last_name,
                  email,
                  phone,
            } = req.body;

            const userData = req.cookies.userData;

            const id = userData.id;

            const isValid = validateFields(req.body, ['first_name', 'last_name', 'email']);

            validateData(!isValid, res, "Faltan campos obligatorios");

            const user = await usersManager.getUser(email, id);

            validateData(!user, res, "El usuario no existe");

            const newPhone = phoneOptions(user.phone, phone);

            const userToUpdate = {
                  ...req.body,
                  phone: newPhone,
                  role: user.role,
                  password: user.password,
            };

            const result = await usersManager.updateUser(user.email, userToUpdate);

            validateData(!result, res, "No se pudo actualizar el usuario");

            const userUpdated = await usersManager.getUser(userToUpdate.email, null);

            cfgSession(userUpdated, req, res);

      } catch (error) {

            handleTryErrorDB(error);

      };


});

export default sessionsRouter;