import { EnvVars } from "../config/env";
import { IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";

export const seedAdmin = async () => {
  try {
    const isAdminExists = await User.findOne({
      email: EnvVars.ADMIN_EMAIL,
      role:"ADMIN"
    });

    if (isAdminExists) {
      // eslint-disable-next-line no-console
      console.log("Admin Already Exists");
      return;
    }

    // eslint-disable-next-line no-console
    console.log("Admin Creating...");

    const hashedPass = await bcrypt.hash(
      EnvVars.ADMIN_PASS,
      Number(EnvVars.BCRYPT_SALT_ROUND)
    );

    const payload: IUser = {
      name: "Admin",
      email: EnvVars.ADMIN_EMAIL,
      password: hashedPass,
      role: Role.ADMIN,
      phone:"01722667560"
    };

    const result = await User.create(payload);

    // eslint-disable-next-line no-console
    console.log("Admin created successfully...", result);
  } catch (error) {

    // eslint-disable-next-line no-console
    console.log(error);
  }
};
