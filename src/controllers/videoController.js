import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment"

export const home = async(req, res) => {
   try{const videos = await Video.find({}).sort({_id:-1});
    res.render("Home", {pageTitle: "home", videos});
   }catch (error){
       console.log(error);
       res.render("home",{pageTitle:"home", videos:[]});
   }
} ;

export const search = async(req, res) => {
    const{
        query: {term : searchingBy}
    } = req;
    let videos=[];
    try { 
        videos = await Video.find({
            title:{$regex:searchingBy, $options:"i"}
        });
    } catch (error) {
        console.log(error);
    }
    res.render("search", {pageTitle: "Search", searchingBy, videos});
};

export const getUpload = (req, res) => res.render("Upload", {pageTitle: "Upload"});
export const postUpload = async(req, res) => { 
    const {
        body: {title, description},
        file: {location} 
    } = req;

  const newVideo = await Video.create({
      fileUrl:location,
      title,
      description,
      creator: req.user.id
  });
  req.user.videos.push(newVideo.id);
  req.user.save();
  console.log(newVideo);
  res.redirect(routes.videoDetail(newVideo.id));
}

export const videoDetail = async (req, res) => {
    const {
        params:{id}
    } = req;
    try {
        const video = await Video.findById(id)
          .populate("creator")
          .populate("comments");
        res.render("VideoDetail", {pageTitle: "Video detail", video});
        console.log(video.comments)
    } catch (error){
        res.redirect(routes.home)
        console.log(error);
    }
 };

export const getEditVideo = async(req, res) => {
 const{ 
   params:{id}
 } = req;
 try{
     const video=await Video.findById(id);
     if(String(video.creator) !== String(req.user.id)){
         console.log(video)
         console.log(req.user.id)
         throw Error();
     }else {
     res.render("editVideo",{pageTitle: `Edit ${video.title}`, video});
    }
 }catch (error){
     console.log(error);
     res.redirect(routes.home);
 }
 };

 export const postEditVideo = async(req, res) => {
    const{ 
      params : {id},
      body : {title, description}
    } = req;
    try{
        await Video.findOneAndUpdate({_id:id},{title, description});
        res.redirect(routes.videoDetail(id))
    } catch (error){
        res.redirect(routes.home);
    }
    };

export const deleteVideo = async(req, res) => {
    const {
        params:{id}
    }=req;
    try{
     const video= await Video.findById(id);
     if(String(video.creator) !== String(req.user.id)){
         throw Error();
     } else{
     await Video.findOneAndRemove({_id:id})
     } 
    }catch (error){
     console.log(error);
    }
    res.redirect(routes.home);
   };
 

export const postRegisterView = async (req, res) => {
    const{
        params:{id}
    } = req;
    try{
      const video = await Video.findById(id);
      video.views += 1;
      video.save();
      res.status(200);
    }catch(error){
      res.status(400);
    } finally{
      res.end();
    }
};

//Add Comment

export const postAddComment = async(req,res) => {
    const{
        params:{id},
        body:{comment},
        user
    } = req;
    try{
        const video = await Video.findById(id);
        const newComment = await Comment.create({
            text: comment,
            creator: user.id
        });
        video.comments.push(newComment.id);
        video.save();
    } catch (error){
        res.status(400);
    } finally{
        res.end();
    }
}

export const deleteComment = async(req, res) =>{
    const{
        params:{id}
    }=req;
    try{
        const comment=await Comment.findById(id)
           .populate("videos")
        if(String(comment.creator) !== String(req.user.id)){
            alert("It's not your comment!")
        } else{
            await Comment.findOneAndRemove({_id:id});
            res.redirect('back');
        }
      }catch (error){
          console.log(error);
      }
    }