export function isAdmin(email, password) {

      const admin = {
            first_name: "Admin",
            last_name: "Coder",
            email: "admincoder@coder.com",
            password: "adminCod3r123",
            role: "admin"
      };

      if (email === admin.email && password === admin.password) {
            return admin;
      } else {
            return false;
      };

};

export function checkSession(req, res, next) {


      if (req.session && req.session.userLogged && req.cookies.userData) {

            next();

      } else {

            console.log("No hay ninguna sesión activa");
            res.redirect('/login');

      };

};

export function cfgSession(user, req, res) {

      if (user) {

            req.session.userLogged = true;

            req.session.user = user._id;

            res.cookie('userData', {
                  id: user._id,
                  first_name: user.first_name,
                  role: user.role
            })

            res.send({
                  status: "success",
                  payload: `El usuario ${user.first_name} ${user.last_name} se ha logueado correctamente`
            });

      } else {

            res.status(401).send({
                  status: "error",
                  payload: `Error en el usuario o contraseña`
            });

      };

}