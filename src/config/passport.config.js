import passport from "passport";
import local from "passport-local";
import { userModel } from "../dao/models/userModel.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;
export const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          let exist = await userModel.findOne({ email: username });
          if (exist) {
            console.error("El usuario ya existe");
            return done(null, false);
          }
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };

          const result = await userModel.create(newUser);
          return done(null, result);
        } catch (error) {
          console.error("passport.config.js", error);
          return done("Error al crear el usuario" + error);
        }
      }
    )
  );

  passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
    try {
        const user = await userModel.findOne({email: username});
        if (!user) {
            console.error("passport.config.js", "No existe el usuario")
            return done(null, false);
        }
        if (!isValidPassword(user, password)) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        console.error("passport.config.js", error);
        return done(error)
    }
}));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};
