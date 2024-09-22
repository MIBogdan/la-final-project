import "./post.scss"
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import moment from "moment";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { makeRequest } from "../../axios.js"



function Post ({post}) {
    const [commentOpen, setCommentOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const {currentUser} = useContext(AuthContext);
    const [commentCount, setCommentCount] = useState(0);

    

    const { isLoading, error, data } = useQuery({
        queryKey: ['likes', post.id],
        queryFn: () =>
          makeRequest.get('/likes?postId=' + post.id).then((res) => res.data),

      });



    const { isLoadingComments, commentsError, commentsCountData } = useQuery({
        queryKey: ['comments', post.id],
        queryFn: () =>
          makeRequest.get(`/comments?postId=` + post.id).then((res) => {
            setCommentCount(res.data.length); 
            return res.data;
          }),

      });


      const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (liked) => {if (liked) return makeRequest.delete("/likes?postId=" + post.id)
            return makeRequest.post("/likes", {postId: post.id})
        },
        onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ['likes'] })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (postId) => {
            return makeRequest.delete(`/posts/${postId}`)
        },
        onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
    })

    const handleLike = () => {
        mutation.mutate(data.includes(currentUser.id))
    }

    const handleDelete = () => {
        deleteMutation.mutate(post.id)
    }
      
    
  return (
    <div className={currentUser.id === 0 ? "guest-wrapper" : ""}>
        <div className={`post ${currentUser.id === 0 ? "guest-container" : ""}`} >
        <div className="container" >
            <div className="user">
                <div className="userInfo">
                    <img src={"/upload/" + post.profilePic} alt="" />
                    <div className="details">
                        <Link to={`/profile/${post.userId}`} style={{textDecoration: "none", color: "inherit"}}>
                            <span className="name">{post.name}</span>
                            
                        </Link>
                        <span className="date">{moment(post.createdAt).fromNow()}</span>
                    </div>
                </div>
                <div className={`deletePost ${menuOpen ? 'dotsActive' : ''}`}>
                    <div className="dots">
                        {currentUser.id !== 0 && <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)}/>}
                    </div>
                    <div className="openMenu">
                        {menuOpen && <button className="deleteBtn" onClick={handleDelete}>Delete post</button> }
                    </div>
                    
                </div>
            </div>


            <div className="content">
                <p>{post.desc}</p>
                <img src={"/upload/" + post.img} alt="" />
            </div>
            <div className="info">
                <div className="item" style={currentUser.id === 0 ? {cursor: "unset"} : {}}>
                    {currentUser.id === 0 ? null : isLoading ? <div>Loading...</div> : data.includes(currentUser.id) ? <FavoriteOutlinedIcon style={{color: "red"}} onClick={handleLike}/>  :  <FavoriteBorderOutlinedIcon onClick={handleLike}/>}
                    {data && data.length !== 1 ? `${data.length} Likes` : '1 Like'}
                </div>

                <div className="item" style={currentUser.id === 0 ? {cursor: "unset"} : {}} onClick={currentUser.id !== 0 ? () => setCommentOpen(!commentOpen) : undefined}>
                    {currentUser.id !== 0 && <TextsmsOutlinedIcon/>}
                    {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
                </div>
                
            </div>
            {commentOpen ? (
                isLoadingComments ? (
                    "Loading..."
                ) : commentsError ? (
                    "An error occurred while fetching comments."
                ) : (
                    <Comments postId={post.id} setCommentCount={setCommentCount} />
                )
            ) : null}

        </div>
        
    </div>
    </div>
    
  )
}

export default Post;