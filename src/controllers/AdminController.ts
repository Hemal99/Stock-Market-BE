import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { UserLoginInput } from "../dto";
import { User } from "../models";
import { Role } from "../utility/constants";

import { GenerateSignature, ValidatePassword } from "../utility";
import { Video } from "../models/Video";
import { Counters } from "../models/Counter";
import { Lesson } from "../models/Lesson";
import { Payment } from "../models/Payment";
import { StudyPackPayment } from "../models/StudyPackPayment";
import { Pdf } from "../models/Pdf";
import { Paper } from "../models/Paper";
import { StudyPack } from "../models/StudyPack";

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

export const GetStudentPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const { month } = req.params;

    if (user && user.role === Role.Admin) {
      const profiles = await Payment.aggregate([
        {
          $match: {
            month: Number(month),
            year: currentYear,
            userId: { $ne: null },
          },
        },
        {
          $lookup: {
            from: "users", // Replace with the actual collection name for users
            localField: "userId",
            foreignField: "_id",
            as: "userId",
          },
        },
        {
          $unwind: "$userId",
        },
      ]);

      if (profiles) {
        return res.status(200).json(profiles);
      }
    }
    return res.status(400).json({ msg: "Error while Fetching Profiles" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

// Student Pack Payment

export const GetStudentPackPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user && user.role === Role.Admin) {
      const profiles = await StudyPackPayment.find({}).populate(
        "studyPackUserId"
      );

      if (profiles) {
        return res.status(200).json(profiles);
      }
    }
    return res.status(400).json({ msg: "Error while Fetching Profiles" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const GetStudentCount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user && user.role === Role.Admin) {
      const count = await User.find({ role: Role.Student }).count();

      if (count >= 0) {
        return res.status(200).json(count);
      }
    }
    return res.status(400).json({ msg: "Error while Fetching Profiles" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const GetStudentProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  if (id) {
    const profile = await User.findById(id);

    if (profile) {
      return res.status(200).json(profile);
    }
  }
  return res.status(400).json({ msg: "Error while Fetching Profile" });
};

// Approve Student

export const ApproveStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { _id, approval, paymentId } = req.body;

    if (user && user.role === Role.Admin) {
      let user_status;

      if (approval === true) {
        user_status = "approved";
      } else {
        user_status = "rejected";
      }

      const payment = await Payment.findOneAndUpdate(
        { _id: paymentId },
        { $set: { status: user_status } }
      );

      return res.status(200).json(payment);
    }
    return res.status(400).json({ msg: "Error while updating Payment" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

// check slip

export const CheckSlip = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { paymentId } = req.body;

    if (user && user.role === Role.Admin) {
      const profile = await Payment.findOneAndUpdate(
        { _id: paymentId },
        { $set: { checked: true } }
      );

      if (profile) {
        return res.status(200).json(profile);
      }
    }
    return res.status(400).json({ msg: "Error while updating Profile" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

// check slip

export const CheckStudyPackSlip = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { paymentId } = req.body;

    if (user && user.role === Role.Admin) {
      const profile = await StudyPackPayment.findOneAndUpdate(
        { _id: paymentId },
        { $set: { checked: true } }
      );

      if (profile) {
        return res.status(200).json(profile);
      }
    }
    return res.status(400).json({ msg: "Error while updating Profile" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

// Approve Study Pack Student

export const ApproveStudyPack = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { _id, approval, paymentId } = req.body;

    if (user && user.role === Role.Admin) {
      let user_status;

      if (approval === true) {
        user_status = "approved";
      } else {
        user_status = "rejected";
      }

      const payment = await StudyPackPayment.findOneAndUpdate(
        { _id: paymentId },
        { $set: { status: user_status } }
      );

      return res.status(200).json(payment);
    }
    return res
      .status(400)
      .json({ msg: "Error while updating Study Pack Payment" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

// delete user

export const DeleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (user && user.role === Role.Admin) {
      const profile = await User.findOneAndDelete({ _id: id });

      if (profile) {
        return res.status(200).json(profile);
      }
    }
    return res.status(400).json({ msg: "Error while Deleting Profile" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

// video

export const AddVideo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const user = req.user;
    const { videoUrl, title, limit, description, lessonId, thumbnail } =
      req.body;

    //  if (user && user.role === Role.Admin) {
    const video = await Video.create({
      videoUrl: videoUrl,
      title: title,
      description: description,
      limit: limit,
      lessonId: lessonId,
      thumbnail: thumbnail,
    });

    return res.status(201).json({ video: video.videoUrl });
    //  }
    // return res.status(400).json({ msg: "Error while Saving Video" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

// Get All Videos

export const GetVideos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const videos = await Video.find().populate("lessonId");

  if (videos) {
    return res.status(200).json(videos);
  }

  return res.status(400).json({ msg: "Error while Fetching Videos" });
};

// Get  Video Title

export const GetVideoByTitle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const title = req.params.title;

  if (title) {
    const video = await Video.findOne({ title });

    if (video) {
      return res.status(200).json(video);
    }
  }

  return res.status(400).json({ msg: "Error while Fetching Video" });
};

// Get  Video by Id

export const GetVideoById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (id) {
      const video = await Video.findById(id);

      if (video) {
        return res.status(200).json(video);
      }
    }

    return res.status(400).json({ msg: "Error while Fetching" });
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Edit Video

export const EditVideo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const { id } = req.params;

  const { videoUrl, title, description, lessonId, thumbnail } = req.body;

  if (user) {
    const video = await Video.findById(id);

    if (video) {
      video.title = title;
      video.description = description;
      video.lessonId = lessonId;
      video.videoUrl = videoUrl;
      video.thumbnail = thumbnail;
      const result = await video.save();

      return res.status(201).json(result);
    }
  }
  return res.status(400).json({ msg: "Error while Updating Video" });
};

// Delete Video

export const DeleteVideo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (user && user.role === Role.Admin) {
      const video = await Video.findOneAndDelete({ _id: id });

      if (video) {
        return res.status(200).json(video);
      }
    }
    return res.status(400).json({ msg: "Error while Deleting Video" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

// pdf

export const AddPdf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { pdfUrl, title, description, lessonId } = req.body;

    //if (user && user.role === Role.Admin) {
    const pdf = await Pdf.create({
      pdfUrl: pdfUrl,
      title: title,
      description: description,
      lessonId: lessonId,
    });

    return res.status(201).json({ pdf: pdf.pdfUrl });
    //}
    //return res.status(400).json({ msg: "Error while Saving Pdf" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

// Get All Pdf

export const GetAllPdf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pdf = await Pdf.find();

  if (pdf) {
    return res.status(200).json(pdf);
  }

  return res.status(400).json({ msg: "Error while Fetching pdf" });
};

export const GetPdfById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  if (id) {
    const pdf = await Pdf.findById(id);

    if (pdf) {
      return res.status(200).json(pdf);
    }
  }

  return res.status(400).json({ msg: "Error while Fetching Pdf" });
};

// Delete Video

export const DeletePdf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (user && user.role === Role.Admin) {
      const pdf = await Pdf.findOneAndDelete({ _id: id });

      if (pdf) {
        return res.status(200).json(pdf);
      }
    }
    return res.status(400).json({ msg: "Error while Deleting Pdf" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

// counter

export const Counter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const counter = await Counters.find();
    res.status(200).json({
      id: counter[0].id,
      c: counter[0].c,
      p: counter[0].p,
      cp: counter[0].cp,
    });
  } catch (error) {
    return res.sendStatus(500);
  }
};

//reset counter

export const ResetCounter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Counters.deleteMany({});
    const counter = new Counters({
      c: 220,
      p: 285,
      cp: 620,
    });
    await counter.save();
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
};

// paper

export const AddPaper = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const {
      paperUrl,
      title,
      description,
      lessonId,
      paperType,
      subject,
      markingSchemeUrl,
    } = req.body;

    if (user && user.role === Role.Admin) {
      const paper = await Paper.create({
        paperUrl: paperUrl,
        title: title,
        description: description,
        lessonId: lessonId,
        paperType: paperType,
        subject: subject,
        markingSchemeUrl: markingSchemeUrl,
      });

      return res.status(201).json({ paper: paper.paperUrl });
    }
    return res.status(400).json({ msg: "Error while Saving Paper" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

// Get All Paper

export const GetAllPaper = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user && user.role === Role.Admin) {
      const paper = await Paper.find();
      return res.status(200).json(paper);
    }
    return res.status(400).json({ msg: "Error while Fetching Paper" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

// Get Paper By Id

export const GetPaperById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  if (id) {
    const paper = await Paper.findById(id);

    if (paper) {
      return res.status(200).json(paper);
    }
  }

  return res.status(400).json({ msg: "Error while Fetching Paper" });
};

// Edit Paper

export const EditPaper = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const { id } = req.params;

  const {
    paperUrl,
    title,
    description,
    lessonId,
    paperType,
    subject,
    markingSchemeUrl,
  } = req.body;

  if (user) {
    const paper = await Paper.findById(id);

    if (paper) {
      paper.paperUrl = paperUrl;
      paper.title = title;
      paper.description = description;
      paper.lessonId = lessonId;
      paper.paperType = paperType;
      paper.subject = subject;
      paper.markingSchemeUrl = markingSchemeUrl;

      const result = await paper.save();

      return res.status(201).json(result);
    }
  }
  return res.status(400).json({ msg: "Error while Updating Paper" });
};

// Delete Paper

export const DeletePaper = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (user && user.role === Role.Admin) {
      const paper = await Paper.findOneAndDelete({ _id: id });

      if (paper) {
        return res.status(200).json(paper);
      }
    }
    return res.status(400).json({ msg: "Error while Deleting Pdf" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const AddStudyPack = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const {
      name,
      description,
      videoIds,
      thumbnail,
      tutes,
      papers,
      price,
      subject,
    } = req.body;

    if (user && user.role === Role.Admin) {
      const studyPack = await StudyPack.create({
        name,
        description,
        videoIds,
        thumbnail,
        tutes,
        papers,
        price,
        subject,
      });

      return res.status(201).json(studyPack);
    }
    return res.status(400).json({ msg: "Error while Saving Paper" });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

// Get All Paper

export const GetStudyPacks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user && user.role === Role.Admin) {
      const studyPacks = await StudyPack.find();
      return res.status(200).json(studyPacks);
    }
    return res.status(400).json({ msg: "Error while Fetching Study Packs" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

// Delete Paper

export const DeleteStudyPack = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (user && user.role === Role.Admin) {
      const studyPack = await StudyPack.findOneAndDelete({ _id: id });

      if (studyPack) {
        return res.status(200).json(studyPack);
      }
    }
    return res.status(400).json({ msg: "Error while Deleting Study pack" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

// Populating checked

export const GetChecked = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Update operation
    await StudyPackPayment.updateMany({}, { $set: { checked: false } });

    // await Payment.updateMany({}, { $set: { status: "approved" } });

    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};
