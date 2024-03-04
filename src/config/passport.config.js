import passport from "passport";
import { Strategy } from "passport-local";
import User from "../dao/usersDao.js";
import { comparePassword, encryptPassword } from "../utils/encrypt.utils.js";

const initializePassport = () => {
	passport.use("register", new Strategy({
		passReqToCallback: true,
		usernameField: "email",
		passwordField: "password",
	}, async (req, username, password, done) => {
		let { first_name, last_name, age } = req.body;

		if (!first_name || !last_name || !age) {
			return done(null, false, { message: "All fields are required" });
		}

		try{

			let user = await User.getUserByEmail(username);
			if (user) {
				return done(null, false, { message: "Email is already registered" });
			}
			
			let hashedPassword = await encryptPassword(password);
			user = await User.addUser({ first_name, last_name, age, email: username, password: hashedPassword });
			return done(null, user);
		} catch (error) {
			console.log(error)
			return done(null, false, { message: "Hubo un error al crear el usuario" });
		}
	}))

	passport.use("login", new Strategy({
		usernameField: "email",
		passwordField: "password",
		passReqToCallback: true
	}, async (req,username, password, done) => {
		try {
		let user = await User.getUserByEmail(username);
		if (!user) {
			return done(null, false, { message: "User not found" });
		}

		if (!await comparePassword(password, user.password)) {
			return done(null, false, { message: "Password incorrect" });
		}

		
		// req.session.user = user;

		return done(null, user);
		} catch (error) {
			console.log(error)
			return done(null, false, { message: "Hubo un error al loguear el usuario" });
		}
	}))

	passport.serializeUser((user, done) => {
		return done(null, user._id);
	})

	passport.deserializeUser(async (id, done) => {
		let user = await User.getUserById(id);
		return done(null, user);
	})
}

export default initializePassport;