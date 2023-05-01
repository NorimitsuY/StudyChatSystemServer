import jwt from "jsonwebtoken";
import config from "../../jwt/config";
import { RequestHandler } from "express";

export class Auth{
    isAuth:RequestHandler = async(req,res,next) => {
        try {
            const token = req.cookies.token;
            const authHeader = req.get("Authorization");
            const decoded = jwt.verify(token, config.jwt.secret);
            next();
        } catch (err) {
            return res.status(401).json({
              message: 'Not authenticated'
            });
        }
    }; 
    isAdminAuth:RequestHandler = async(req,res,next) => {
        try {
            const token = req.cookies.token;
            const authHeader = req.get("Authorization");
            const decoded = jwt.verify(token, config.jwt.secret);
            if(typeof decoded !== "string" && decoded.usertype === "ADMIN")
            {
                next();
            }
            else
            {
                const error = new Error("Not Authenticated");
                throw error;
            }
        } catch (err) {
            return res.status(401).json({
              message: 'Not authenticated'
            });
        }
    };
    getLoginUserInfo:RequestHandler = async(req,res,next) => {
        try {
            const token = req.cookies.token;
            const authHeader = req.get("Authorization");
            const decoded = jwt.verify(token, config.jwt.secret);
            if(typeof decoded !== "string")
            {
                res.locals._id = decoded._id;
                next();
            }
            else
            {
                const error = new Error("Not Authenticated");
                throw error;
            }
        } catch (err) {
            return res.status(401).json({
              message: 'Not authenticated'
            });
        }
    }; 
};