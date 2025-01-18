import { Request, Response, NextFunction } from "express";

const allowedOrigins = ["http://localhost:4200", "https://lulinks-7e45f.web.app", "https://api-izb6asxh2a-uc.a.run.app" , "https://demindly.web.app" ];

export const corsHandler = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin as string;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
};
