import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import {
  CreateCustomerInput,
  EditCustomerProfileInput,
  UserLoginInput,
} from "../dto";
import { User, Counters } from "../models";

import {
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} from "../utility";
import { Role } from "../utility/constants";
import { sendMail } from "../services/MailService";
import { Video } from "../models/Video";
import { WatchTime } from "../models/WatchTime";
import { Payment } from "../models/Payment";
import { PaymentInputDto } from "../dto/Payment.dto";
import { Pdf } from "../models/Pdf";

const mongoose = require("mongoose");

export const sendEmailFunc = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, classId } = req.body;
    await sendMail(email, classId);
    return res.status(200).json({ message: "Email Sent" });
  } catch (err) {
    return res.sendStatus(500);
  }
};

export const UserSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();

  try {
    const customerInputs = plainToClass(CreateCustomerInput, req.body);

    const validationError = await validate(customerInputs, {
      validationError: { target: true },
    });

    if (validationError.length > 0) {
      return res.status(400).json(validationError);
    }

    const { firstName, lastName, email, password, phone } = customerInputs;

    session.startTransaction();

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    const existingUser = await User.findOne({ email: email }).session(session);

    if (existingUser !== null) {
      return res.status(400).json({ message: "User already exist!" });
    }

    const user = new User({
      email: email,
      password: userPassword,
      role: Role.Admin,
      salt: salt,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
    });

    const result = await user.save({ session });

    //Generate the Signature
    const signature = await GenerateSignature({
      _id: result._id,
      phone: result.phone,
      role: result.role,
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

export const UserLogin = async (
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

  const student = await User.findOne({ email });

  console.log(student);

  if (student && student?.role === Role.Student) {
    const validation = await ValidatePassword(
      password,
      student.password,
      student.salt
    );

    if (validation) {
      const signature = await GenerateSignature({
        _id: student._id,
        phone: student.phone,
        role: student.role,
      });
      const userId = student._id;
      const payment = await Payment.find({
        userId,
      })
        .sort({ year: -1, month: -1 })
        .limit(1);
      return res.status(200).json({
        payment,
        signature,
        student: {
          role: student.role,
          paid: student.paid,
          classId: student.classId,
          firstName: student.firstName,
          lastName: student.lastName,
          _id: student._id,
          phone: student.phone,
          email: student.email,
          classType: student.classType || "none",
        },
      });
    } else {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }
  }

  return res.json({ msg: "Error With SignIn" });
};

export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await User.findById(customer._id);

    if (profile) {
      return res.status(201).json(profile);
    }
  }
  return res.status(400).json({ msg: "Error while Fetching Profile" });
};

export const EditCustomerProfile = async (
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

// Get  Video By LessonId
export const GetVideosByLessonId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lessonId = req.params.lessonId;
    const userId = req.params.userId;
    let videodata: any = [];
    if (lessonId) {
      const videos = await Video.find({ lessonId });

      if (videos.length > 0) {
        videodata = await Promise.all(
          videos.map(async (video: any) => {
            const watchTime = await WatchTime.find({
              videoId: video._id,
              userId: userId,
            });

            if (watchTime.length > 0) {
              return {
                ...video._doc,
                watchTime: watchTime[0],
              };
            }
            return {
              ...video._doc,
              watchTime: null,
            };
          })
        );
      }
      return res.status(200).json(videodata);
    }
    return res.status(400).json({ msg: "Error while Fetching Video" });
  } catch (err) {
    return res.status(400).json({ msg: "Error while Fetching Video" });
  }
};

export const GetPdfsByLessonId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lessonId = req.params.lessonId;

    if (lessonId) {
      const pdfs = await Pdf.find({ lessonId });

      return res.status(200).json(pdfs);
    }
    return res.status(400).json({ msg: "Error while Fetching Pdf" });
  } catch (err) {
    return res.status(500).json({ msg: "Error while Fetching Pdf" });
  }
};

export const UserForgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, classId, newPassword } = req.body;

    const user = await User.findOne({ email, classId });

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(newPassword, salt);

    if (user) {
      user.password = userPassword;
      user.salt = salt;

      await user.save();

      return res.status(200).json({ msg: "Password Changed Successfully" });
    }

    return res.status(400).json({ msg: "Error while Changing Password" });
  } catch (err) {
    return res.status(500).json({ msg: "Error while Fetching Pdf" });
  }
};
