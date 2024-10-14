import { Router } from "express";
import {
	getLoggedInUser,
	getUser,
	signinUser,
	signoutUser,
	signupUser,
} from "../controllers/userController";
import { isLoggedIn } from "../middlewares/auth";

const router = Router();

router.route("/sign-up").post(signupUser);
router.route("/sign-in").post(signinUser);
router.route("/sign-out").post(signoutUser);
router.route("/me").get(isLoggedIn, getLoggedInUser);
router.route("/:id").get(getUser);

export default router;
