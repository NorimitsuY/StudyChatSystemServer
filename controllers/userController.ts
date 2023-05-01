import { RequestHandler } from "express";
import userInfo from "../models/userInfo";
import jwt from "jsonwebtoken";
import config from "../jwt/config";
import bcrypt from "bcrypt"

export class User{
    getAllUsers:RequestHandler = async (req,res) =>{
        try
        {
            const allUsers = await userInfo.find({}).select("email name password usertype");
            res.status(200).json(allUsers);
        }
        catch(err)
        {
            res.status(500).json(err);
        }
    };
    AddUser:RequestHandler = async (req,res) => {
        let resResult = {ok:false};
        try
        {
            const password = await bcrypt.hash(req.body.password, 10)
            let newUserInfo = {
                email:req.body.email,
                name:req.body.name,
                password:password,
                usertype:req.body.usertype
            };
            userInfo.create(newUserInfo)
            .then(result => {
                resResult.ok = true;
                res.status(200).json({ok:true});
            })
            .catch(error => {
                res.status(500).json({ok:false, error:error.message}); 
            });
        }
        catch(err)
        {
            res.status(500).json(err);
        }
    };
    getLoginUserInfo:RequestHandler = async (req,res) => {
        try
        {
            await userInfo.findOne({_id:res.locals._id}).select("email name usertype")
            .then(user => {
                res.status(200).json(user);
            })
            .catch(err => {
                res.status(500).json({status:"NG",message:err.message});
            });
        }
        catch(err)
        {
            res.status(500).json(err);
        }  
    };
    loginCheck:RequestHandler = async (req,res) =>{
        try
        {
            res.status(200).json({loginStat:true});
        }
        catch(err)
        {
            res.status(500).json(err);
        }
    }
    login:RequestHandler = async (req,res) => {
        try
        {
            const user = await userInfo.findOne({email:req.body.email}).select("email name password usertype");
            if(user === null)
            {
                throw new Error('メールアドレス、もしくはパスワードが間違っています。');
            }
            const valid = await bcrypt.compare(req.body.password, user.password);
            if(!valid){
                throw new Error('メールアドレス、もしくはパスワードが間違っています。');
            }
            const payload = {
                email:user.email,
                name:user.name,
                usertype:user.usertype,
                _id:user._id
            };
            
            const token = jwt.sign(payload, config.jwt.secret, {expiresIn:config.jwt.options.expiresIn,algorithm:"HS256"});
            console.log("成功");
            res.cookie('token', token, {maxAge:1000 * 3600 * 24,  httpOnly: true });
            const body = {
                status:"OK",
                token:token
            };
            res.status(200).json(body);

        }
        catch(err:any)
        {
            res.status(500).json({status:"NG",message:err.message});
        }
    };
    logout:RequestHandler = async (req,res) =>{
        res.clearCookie('token',{ httpOnly: true });
        res.status(200).json({});
    };
};