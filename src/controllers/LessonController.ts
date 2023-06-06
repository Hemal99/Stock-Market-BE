import { plainToClass } from "class-transformer";
import { CreateLessonInput, SubjectEnum } from "../dto";
import { Request, Response, NextFunction } from "express";
import { Lesson } from "../models/Lesson";
import { Role } from "../utility/constants";

export const createLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lessonInputs = plainToClass(CreateLessonInput, req.body);

    const { name, description, subject, thumbnail } = lessonInputs;

    const user = req.user;

    if (user && user.role === Role.Admin) {
      const lesson = new Lesson({
        lessonName: name,
        lessonDescription: description,
        lessonThumbnail: thumbnail,
        subject,
      });

      const result = await lesson.save();
      return res.status(201).json(result);
    }

    return res.status(401).json({ msg: "Not Authorized" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const getChemistryLessons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lessons = await Lesson.find({ subject: SubjectEnum.CHEMISTRY });
    return res.status(200).json(lessons);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const getPhysicsLessons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lessons = await Lesson.find({ subject: SubjectEnum.PHYSICS });
    return res.status(200).json(lessons);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// get All Lessons

export const getAllLessons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user && user.role === Role.Admin) {
      const lessons = await Lesson.find();
      return res.status(200).json(lessons);
    }

    return res.status(401).json({ msg: "Error while Fetching Lessons" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

// Delete Video

export const DeleteLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (user && user.role === Role.Admin) {
      const lesson = await Lesson.findOneAndDelete({ _id: id });

      if (lesson) {
        return res.status(200).json(lesson);
      }
    }
    return res.status(400).json({ msg: "Error while Deleting Lesson" });
  } catch (error) {
    return res.sendStatus(500);
  }
};
