import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");



const increaseNumber = (req, res) => {
    
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) +1
    res.redirect(routes.videoDetail(videoId));

}


const addComment = (comment) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const div = document.createElement("div");
    span.innerHTML = comment;
    div.innerHTML = "❌"
    li.appendChild(span);
    li.appendChild(div);
    commentList.prepend(li);
    increaseNumber();
}


const sendComment = async comment => {
 const videoId = window.location.href.split("/videos/")[1];
 const response = await axios({
    url: `/api/${videoId}/comment`,
    method:"POST",
    data:{
      comment
    }
    });
    console.log(response);
    if(response.status === 200){
        addComment(comment);
    }
}

const handleSubmit = event => {
    event.preventDefault();
    const commentInput = addCommentForm.querySelector("input");
    const comment = commentInput.value;
    sendComment(comment);
    commentInput.value = "";

}

function init() {
    addCommentForm.addEventListener("submit", handleSubmit);
}

if (addCommentForm) {
  init();
}