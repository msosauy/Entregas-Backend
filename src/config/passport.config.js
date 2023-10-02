import passport from "passport";
import local from "passport-local";
import { userModel } from "../dao/models/userModel.js";
import { createHash, isValidPassword } from "../utils.js";
import gitHubStrategy from "passport-github2";

const LocalStrategy = local.Strategy;
const GitHubStrategy = gitHubStrategy.Strategy;

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

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          if (!user) {
            console.error("passport.config.js", "No existe el usuario");
            return done(null, false);
          }
          if (!isValidPassword(user, password)) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          console.error("passport.config.js", error);
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.d4a029c9796860cd",
        clientSecret: "b223f82dcb7de00e5f720ab205a45c75b89a4d00",
        callBackUrl: "http://localhost:8080/session/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userModel.findOne({ email: profile._json.name });
          if (!user) {
            const newUser = { first_name: profile.username, userName: profile._json.login, email: profile._json.html_url, age: profile._json.public_repos };
            const result = await userModel.create(newUser);
            return done(null, result);
          }
          done(null, user);
        } catch (error) {
          console.error("passport.config.js error", error);
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};
