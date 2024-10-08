import { useContext, useState, useEffect } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient, } from '@tanstack/react-query'
import { makeRequest } from "../../axios.js"
import moment from "moment";


function Comments ({postId, setCommentCount}) {
    const {currentUser} = useContext(AuthContext);

    const [desc, setDesc] = useState("");
    
    const { isLoading, error, data } = useQuery({
        queryKey: ['comments'],
        queryFn: () =>
          makeRequest.get('/comments?postId=' + postId).then((res) => res.data),
      });
      

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (newComment) => {return makeRequest.post("/comments", newComment)},
        onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ['comments'] })
        },
    })

    const handleClick = async (e) => {
        e.preventDefault();
        mutation.mutate({desc, postId})
        setDesc("")
    }

    useEffect(() => {
        if (data) {
            setCommentCount(data.length);
        }
    }, [data, setCommentCount]);

    


  return (
    
    <div className="comments">
        <div className="write">
            <img src={"/upload/" + currentUser.profilePic} alt="" />
            <input type="text" 
            placeholder="write a comment..." 
            value={desc}
            onChange={(e) => setDesc(e.target.value)}/>
            <button onClick={handleClick}>Send</button>
        </div>
        {isLoading ? "Loading..." : data.map((comment) => {
            return (
                <div className="comment" key={comment.id}>
                <img src={"/upload/" + comment.profilePic} alt="" />
                <div className="info">
                    <span>{comment.name}</span>
                    <p>{comment.desc}</p>
                    
                </div>
                <span className="date">{moment(comment.createdAt).fromNow()}</span>
            </div>
            )
        })}
    </div>
  )
}

export default Comments;
