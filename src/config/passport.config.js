import passport from "passport";
import { Strategy } from "passport-local";
import GithubStrategy from "passport-github2";
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

	passport.use(new GithubStrategy({
		clientID: process.env.GITHUB_CLIENT_ID,
		clientSecret: process.env.GITHUB_CLIENT_SECRET,
		callbackURL: "http://localhost:4000/api/users/githubcallback"
	}, async (accessToken, refreshToken, profile, done) => {
		try {
			if (!profile._json.email) {
				return done(null, false, { message: "Email is required" });
			}
			let user = await User.getUserByEmail(profile._json.email)
			if (!user) {
				let newUser = {
					first_name: profile._json.name,
					last_name: '',
					age: 18,
					email: profile._json.email,
					password: ''
				}

				let result = await User.addUser(newUser);
				done(null, result);
			} else {
				done(null, user);
			}
		} catch (error) {
			console.log(error)
			done(null, false, { message: "Hubo un error al loguear el usuario" });
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