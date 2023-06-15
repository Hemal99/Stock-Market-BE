import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { UserLoginInput } from "../dto";
import { User } from "../models";
import { Role } from "../utility/constants";

import { GenerateSignature, ValidatePassword } from "../utility";


export const AdminLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInputs = plainToClass(UserLoginInput, req.body);

  const validationError = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (validationError.length > 0) {
    return res.status(400).json(validationError);
  }

  const { email, password } = customerInputs;
  const user = await User.findOne({ email });
  if (user && user?.role === Role.Admin) {
    const validation = await ValidatePassword(
      password,
      user.password,
      user.salt
    );

    if (validation) {
      const signature = await GenerateSignature({
        _id: user._id,
        phone: user.phone,
        role: user.role,
      });

      return res.status(200).json({
        signature,
        phone: user.phone,
        id: user._id,
      });
    }
  }

  return res.status(401).json({ msg: "Invalid Credentials" });
};

export const GetStudentProfiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user && user.role === Role.Admin) {
      const profiles = await User.find({ role: Role.Student });

      if (profiles) {
        return res.status(200).json(profiles);
      }
    }
    return res.status(400).json({ msg: "Error while Fetching Profiles" });
  } catch (error) {
    return res.sendStatus(500);
  }
};
