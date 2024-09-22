import { Link } from "react-router-dom";
import "./posts.scss";
import Post from "../post/Post";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { useQuery } from '@tanstack/react-query'
import { makeRequest } from "../../axios.js"


function Posts ({userId}) {



const {currentUser} = useContext(AuthContext)

const { isLoading, error, data } = useQuery({
  queryKey: ['posts'],
  queryFn: () =>
    currentUser.id === 0
  ? makeRequest.get('/posts?userId=' + currentUser.id).then((res) => res.data) 
  : makeRequest.get('/posts?userId=' + userId).then((res) => res.data),

  
});



  return (
    <div className="posts" style={currentUser.id === 0 ? {alignItems: 'center'} : {}}>
      {currentUser.id === 0 && 
        <div className="discover">
          <h1>Discover</h1>
          <div className="loginBtn">
            <Link to="/login" >
              <button>Login for full experience</button>
            </Link>
          </div>
          
        </div>
        
      }

      

      {error
        ? "Something went wrong."
        : isLoading
        ? "Loading..."
        : data.map((post) => {return <Post post={post} key={post.id}/>})
      }
    </div>
  )
}

export default Posts;