import { plainToClass } from "class-transformer";
import { Request, Response, NextFunction } from "express";
import {
  CreateStudPackUserInput,
  LoginStudPackUserInput,
} from "../dto/StudyPackUser.dto";
import { StudyPackUser } from "../models/StudyPackUser";
import { StudyPack } from "../models/StudyPack";
import { StudyPackPayment } from "../models/StudyPackPayment";
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

export const registerStudypackUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const studypackInputs = plainToClass(CreateStudPackUserInput, req.body);
    const { email, password, username } = studypackInputs;
    const studypackUserObj = await StudyPackUser.findOne({
      email: email,
    });
    if (studypackUserObj) {
      return res.status(400).json({ msg: "User already exists" });
    } else {
      const studypackUserObj = new StudyPackUser({
        email,
        password,
        username,
      });
      const result = await studypackUserObj.save();

      return res.status(201).json(result);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const LoginStudypackUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const studypackInputs = plainToClass(LoginStudPackUserInput, req.body);
    const { email, password } = studypackInputs;
    const studypackUserObj = await StudyPackUser.findOne({
      email: email,
      password: password,
    });
    if (studypackUserObj) {
      return res.status(200).json(studypackUserObj);
    }
    return res.status(400).json({ msg: "Invalid credentials" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const getStudyPacks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const subject = req.query.subject;

    const query = StudyPack.find()
      .populate("videoIds")
      .populate("tutes")
      .populate("papers");

    if (subject) {
      query.where("subject").equals(subject);
    }

    const studypacks = await query.exec();

    return res.status(200).json(studypacks);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const getMyStudyPacks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const studypackUserId = req.query.studypackUserId;
    const subject = req.query.subject;

    const query = StudyPackPayment.aggregate([
      {
        $match: {
          studyPackUserId: ObjectId(studypackUserId),
          studyPackId: { $exists: true, $ne: null },
          $expr: {
            $lt: [
              { $subtract: [new Date(), "$createdAt"] },
              30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
            ],
          },
        },
      },
      {
        $lookup: {
          from: "studypacks",
          localField: "studyPackId",
          foreignField: "_id",
          as: "studyPackId",
        },
      },
      {
        $unwind: "$studyPackId",
      },
      {
        $match: {
          "studyPackId.subject": subject,
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "studyPackId.videoIds",
          foreignField: "_id",
          as: "studyPackId.videoIds",
        },
      },
      {
        $lookup: {
          from: "pdfs",
          localField: "studyPackId.tutes",
          foreignField: "_id",
          as: "studyPackId.tutes",
        },
      },
      {
        $lookup: {
          from: "paper",
          localField: "studyPackId.papers",
          foreignField: "_id",
          as: "studyPackId.papers",
        },
      },
      {
        $sort: {
          createdDate: -1,
        },
      },
      {
        $group: {
          _id: "$studyPackId",
          latestPayment: {
            $first: "$$ROOT",
          },
        },
      },

      {
        $replaceRoot: {
          newRoot: "$latestPayment",
        },
      },
      {
        $project: {
          _id: 0,
          studyPackId: 1,
        },
      },
      {
        $replaceRoot: {
          newRoot: "$studyPackId",
        },
      },
    ]);

    const studypacks = await query.exec();
    return res.status(200).json(studypacks);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const addStudyPackPayment = async (req: Request, res: Response) => {
  try {
    const { studyPackUserId, studyPackId, status, slipurl } = req.body;

    const payment = new StudyPackPayment({
      studyPackUserId,
      studyPackId,
      status,
      slipurl,
    });
    await payment.save();
    return res.status(201).json({ payment });
  } catch (err) {
    return res.sendStatus(500);
  }
};
