import usersModel from '../models/users.js';

import {
      handleTryErrorDB,
      validateDataDB,
} from '../../helpers/handleErrors.js';

import {
      isAdmin
} from '../../helpers/handleSessions.js';

export default class UsersManager {

      constructor() {
            console.log("Trabajando con base de datos MongoDB");
      };

      getUser = async (email) => {

            try {

                  const user = await usersModel.findOne({
                        email
                  }).lean();

                  validateDataDB(!user, "El usuario no existe");

                  return user;

            } catch (error) {

                  handleTryErrorDB(error);

            };

      };

      registerUser = async (user) => {

            try {

                  const exist = await this.getUser(user.email);

                  validateDataDB(exist, "El usuario ya existe");

                  const result = await usersModel.create(user);

                  validateDataDB(!result, "No se pudo guardar el usuario en la base de datos");

                  return result;

            } catch (error) {

                  handleTryErrorDB(error);

            };

      };

      loginUser = async (user) => {

            try {

                  const existAdmin = isAdmin(user.email, user.password);

                  console.log(user.email + " " + user.password);
                  console.log(existAdmin);

                  if (existAdmin.role === "admin") {

                        const result = await usersModel.create(existAdmin);

                        validateDataDB(!result, "No se pudo guardar el usuario en la base de datos");

                        setTimeout(() => this.deleteAdmin(user.email), 3000);

                        return result;

                  } else {

                        const exist = await this.getUser(user.email);

                        validateDataDB(!exist, "El usuario no existe");

                        validateDataDB(exist.password !== user.password, "La contraseña es incorrecta");

                        return exist;

                  }

            } catch (error) {

                  handleTryErrorDB(error);

            }

      };

      deleteAdmin = async (email) => {

            try {

                  const result = await usersModel.findOneAndDelete({
                        email
                  });

                  validateDataDB(!result, "No se pudo eliminar el usuario");

                  return result;

            } catch (error) {

                  handleTryErrorDB(error);

            };

      };

};