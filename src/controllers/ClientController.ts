import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import {
  CreateCustomerInput,
  EditCustomerProfileInput,
  UserLoginInput,
} from "../dto";
import { User } from "../models";

import {
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} from "../utility";
import { Role } from "../utility/constants";
import { sendMail } from "../services/MailService";
import { Client } from "../models";
import { Ledger } from "../models/Ledger";

const mongoose = require("mongoose");

export const ClientSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();

  try {
    const { fullName, email, password, depositAmount } = req.body;

    session.startTransaction();

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    const existingUser = await User.findOne({ email: email }).session(session);

    if (existingUser !== null) {
      return res.status(400).json({ message: "User already exist!" });
    }

    const user = new Client({
      fullName,
      email,
      password: userPassword,
      salt,
      depositAmount,
    });

    const result = await user.save({ session });

    //Generate the Signature
    const signature = await GenerateSignature({
      _id: result._id,
    });
    // Send the result
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      signature,

      email: result.email,
    });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

export const ClientLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customerInputs = plainToClass(UserLoginInput, req.body);

    const validationError = await validate(customerInputs, {
      validationError: { target: true },
    });

    if (validationError.length > 0) {
      return res.status(400).json(validationError);
    }

    const { email, password } = customerInputs;
    const user = await Client.findOne({ email });
    if (user) {
      const validation = await ValidatePassword(
        password,
        user.password,
        user.salt
      );

      if (validation) {
        const signature = await GenerateSignature({
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
        });

        return res.status(200).json({
          signature,
          id: user._id,
        });
      }
    }

    return res.status(401).json({ msg: "Invalid Credentials" });
  } catch (err) {
    console.log(err);
  }
};

export const GetClientProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Client.findById(customer._id);

    if (profile) {
      return res.status(201).json(profile);
    }
  }
  return res.status(400).json({ msg: "Error while Fetching Profile" });
};

export const EditClientProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  const customerInputs = plainToClass(EditCustomerProfileInput, req.body);

  const validationError = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (validationError.length > 0) {
    return res.status(400).json(validationError);
  }

  const { firstName, lastName, address } = customerInputs;

  if (customer) {
    const profile = await User.findById(customer._id);

    if (profile) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;
      const result = await profile.save();

      return res.status(201).json(result);
    }
  }
  return res.status(400).json({ msg: "Error while Updating Profile" });
};

// Enter Ledger

export const AddLedger = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    const { deposit } = req.body;

    const client = await Client.findById(user?._id);

    if (client) {
      const ledger = {
        deposit,
      };

      const result = await Ledger.create(ledger);

      client.ledgerId.push(result._id);
      await client.save();
      return res.status(201).json(client);
    }
  } catch (err) {
    console.log(err);
  }
};
