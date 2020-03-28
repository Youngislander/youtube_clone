import routes from "./routes";
import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKEY: process.env.AWS_PRIVATE_KEY,
    region : "ap-northeast-2"
})

export const multerVideo = multer({
    storage: multerS3({
        s3,
        acl: "public-read",
        bucket:"wetube/video"
    })
})

export const multerAvatar = multer({
    storage: multerS3({
        s3,
        acl: "public-read",
        bucket:"wetube/avatar"
    })
});


export const localsMiddleware = (req, res, next) => {
 res.locals.siteName = "weTube";
 res.locals.routes = routes;
 res.locals.loggedUser = req.user || null;
 next();
};

export const onlyPublic =(req, res, next)=>{
    if(req.user){
        res.redirect(routes.home);
    } else{
        next();
    }
}

export const onlyPrivate = (req, res, next) => {
    if(req.user){
        next();
    } else{
        res.redirect(routes.home);
    }
};

export const uploadVideo = multerVideo.single("videoFile");
export const uploadAvatar = multerAvatar.single("avatar");