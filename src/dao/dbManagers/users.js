// Se importa el modelo de usuarios.
import usersModel from '../models/users.js';

// Se importan las funciones de manejo de errores desde el helper.
import {
      handleTryErrorDB,
      validateDataDB,
} from '../../helpers/handleErrors.js';

// Se importa la función isAdmin desde el helper para manejar las sesiones.
import {
      isAdmin
} from '../../helpers/handleSessions.js';

export default class UsersManager {

      constructor() {
            console.log("Trabajando con base de datos MongoDB");
      };

      // Método para obtener un usuario por su dirección de correo electrónico.
      getUser = async (email) => {

            try {

                  // Se busca el usuario en la base de datos por su dirección de correo electrónico.
                  const user = await usersModel.findOne({
                        email
                  }).lean();

                  // Si no se encuentra el usuario, se muestra un mensaje de error.
                  validateDataDB(!user, "El usuario no existe");

                  return user;

            } catch (error) {

                  // Se manejan los errores para las consultas a la base de datos.
                  handleTryErrorDB(error);

            };

      };

      // Método para registrar un nuevo usuario en la base de datos.
      registerUser = async (user) => {

            try {

                  // Se verifica si el usuario ya existe en la base de datos.
                  const exist = await this.getUser(user.email);

                  // Si el usuario ya existe, se muestra un mensaje de error.
                  validateDataDB(exist, "El usuario ya existe");

                  // Se crea el usuario en la base de datos.
                  const result = await usersModel.create(user);

                  // Se valida que el usuario se haya guardado correctamente en la base de datos.
                  validateDataDB(!result, "No se pudo guardar el usuario en la base de datos");

                  return result;

            } catch (error) {

                  handleTryErrorDB(error);

            };

      };

      // Método para autenticar a un usuario al iniciar sesión.
      loginUser = async (user) => {

            try {

                  // Se verifica si el usuario es un administrador utilizando la función isAdmin.
                  const existAdmin = isAdmin(user.email, user.password);

                  if (existAdmin.role === "admin") {

                        // Si el usuario es un administrador, se crea y guarda en la base de datos.
                        const result = await usersModel.create(existAdmin);

                        // Se valida que el usuario administrador se haya guardado correctamente.
                        validateDataDB(!result, "No se pudo guardar el usuario en la base de datos");

                        // Se programa un tiempo para eliminar al usuario administrador después de 3 segundos.
                        setTimeout(() => this.deleteAdmin(user.email), 3000);

                        return result;

                  } else {

                        // Si el usuario no es un administrador, se verifica si existe en la base de datos.
                        const exist = await this.getUser(user.email);

                        // Se muestra un mensaje de error si el usuario no existe en la base de datos.
                        validateDataDB(!exist, "El usuario no existe");

                        // Se muestra un mensaje de error si la contraseña es incorrecta.
                        validateDataDB(exist.password !== user.password, "La contraseña es incorrecta");

                        return exist;
                  };

            } catch (error) {

                  // Se manejan los errores para las consultas a la base de datos.
                  handleTryErrorDB(error);

            };

      };

      // Método para eliminar un usuario administrador de la base de datos.
      deleteAdmin = async (email) => {

            try {

                  // Se elimina el usuario administrador por su dirección de correo electrónico.
                  const result = await usersModel.findOneAndDelete({
                        email
                  });

                  // Se valida que el usuario administrador se haya eliminado correctamente.
                  validateDataDB(!result, "No se pudo eliminar el usuario");

                  return result;

            } catch (error) {

                  // Se manejan los errores para las consultas a la base de datos.
                  handleTryErrorDB(error);

            };

      };

};