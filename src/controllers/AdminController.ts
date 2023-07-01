import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { UserLoginInput } from "../dto";
import { Company, User } from "../models";
import { Role } from "../utility/constants";

import { GenerateSignature, ValidatePassword } from "../utility";
import { Stock } from "../models/Stock";

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

// Add Stock

export const AddStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user && user.role === Role.Admin) {
      const stock = await Stock.create(req.body);

      if (stock) {
        return res.status(200).json(stock);
      }
    }
    return res.status(400).json({ msg: "Error while Adding Stock" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

// Get Stocks
export const GetStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user && user.role === Role.Admin) {
      const stock = await Stock.find().populate("companyId");

      if (stock) {
        return res.status(200).json(stock);
      }
    }
    return res.status(400).json({ msg: "Error while Fetching Stock" });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

// Get stocks for users
export const GetStockForUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stock = await Stock.find();

    if (stock) {
      return res.status(200).json(stock);
    }
    return res.status(400).json({ msg: "Error while Fetching Stock" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

// Change the price of a stock
export const ChangeStockPrice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (user && user.role === Role.Admin) {
      const stock = await Stock.findById(req.params.id);
      if (stock) {
        stock.value = req.body.value;
        await stock.save();
        return res.status(200).json(stock);
      }
    }
    return res.status(400).json({ msg: "Error while Updating Stock" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

// update a stock
export const UpdateStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (user && user.role === Role.Admin) {
      const stock = await Stock.findById(req.params.id);
      if (stock) {
        stock.value = req.body.value;
        stock.name = req.body.name;
        stock.type = req.body.type;
        await stock.save();
        return res.status(200).json(stock);
      }
    }
    return res.status(400).json({ msg: "Error while Updating Stock" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

// Delete a stock
export const DeleteStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (user && user.role === Role.Admin) {
      const stock = await Stock.findByIdAndDelete(req.params.id);
      if (stock) {
        return res.status(200).json(stock);
      }
    }
    return res.status(400).json({ msg: "Error while Deleting Stock" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

// Add Company

export const AddCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user && user.role === Role.Admin) {
      const company = await Company.create(req.body);

      if (company) {
        return res.status(200).json(company);
      }
    }
    return res.status(400).json({ msg: "Error while Adding Company" });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

// Get Companies
export const GetCompanies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user && user.role === Role.Admin) {
      const company = await Company.find();

      if (company) {
        return res.status(200).json(company);
      }
    }
    return res.status(400).json({ msg: "Error while Fetching Company" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

// Get Company by ID
export const GetCompanyById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = await Company.findById(req.params.id);

    if (company) {
      return res.status(200).json(company);
    }
    return res.status(400).json({ msg: "Error while Fetching Company" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

// Update Company
export const UpdateCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (user && user.role === Role.Admin) {
      const company = await Company.findById(req.params.id);

   
      if (company) {
        company.companyName = req.body.companyName;
        company.description = req.body.description;
        company.exchangeShortName = req.body.exchangeShortName;
        company.image = req.body.image;
        company.firstQuarter = req.body.firstQuarter;
        company.secondQuarter = req.body.secondQuarter;
        company.thirdQuarter = req.body.thirdQuarter;
        company.stocks = req.body.stocks;

        await company.save();
        return res.status(200).json(company);
      }
    }
    return res.status(400).json({ msg: "Error while Updating Company" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

// Delete Company
export const DeleteCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (user && user.role === Role.Admin) {
      const company = await Company.findByIdAndDelete(req.params.id);
      if (company) {
        return res.status(200).json(company);
      }
    }
    return res.status(400).json({ msg: "Error while Deleting Company" });
  } catch (error) {
    return res.sendStatus(500);
  }
};
