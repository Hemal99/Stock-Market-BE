import { plainToClass } from "class-transformer";
import { WatchTime } from "../models/WatchTime";
import { Request, Response, NextFunction } from "express";
import { CreateWatchTimeInput } from "../dto/WatchTime.dto";

export const getWatchTime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const watchTime = await WatchTime.find();
    return res.status(200).json(watchTime);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const createOrupdateWatchTime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lessonInputs = plainToClass(CreateWatchTimeInput, req.body);

    const { videoId, userId, watchCount, watchMap } = lessonInputs;

    const watchTimeObj = await WatchTime.findOne({
      userId: userId,
      videoId: videoId,
    });
    if (watchTimeObj) {
      watchTimeObj.watchCount = watchCount;
      watchTimeObj.watchMap = watchMap;
      await watchTimeObj.save();
      return res.status(200).json(watchTimeObj);
    } else {
      const watchTimeObj = new WatchTime({
        videoId,
        userId,
        watchCount,
        watchMap,
      });
      const result = await watchTimeObj.save();
      return res.status(201).json(result);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const getWatchTimeByVideoId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { videoId, userId } = req.params;
    const watchTime = await WatchTime.find({
      videoId: videoId,
      userId: userId,
    });
    if (watchTime.length === 0) {
    return res.status(200).json(null);
    } else {
      return res.status(200).json(watchTime);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
