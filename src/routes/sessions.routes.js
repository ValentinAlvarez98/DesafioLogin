import {
      Router
} from 'express';

import UsersManager from '../dao/dbManagers/users.js';

import {
      handleTryErrorDB,
      validateData,
      validateFields
} from '../helpers/handleErrors.js';
import {
      cfgSession
} from '../helpers/handleSessions.js';


import usersModel from '../dao/models/users.js';

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

            validateData(!result, res, "No se pudo guardar el usuario en la base de datos");

            res.send({
                  status: "success",
                  payload: `El usuario ${newUser.first_name} ${newUser.last_name} se ha creado correctamente`
            });

      } catch (error) {

            handleTryErrorDB(error);

      };

});

export default sessionsRouter;