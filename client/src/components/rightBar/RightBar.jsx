import "./right-bar.scss";
import {makeRequest} from "../../axios";
import { AuthContext } from '../../context/authContext';
import { useState, useEffect, useContext } from "react";
import { useLocation, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns';

function RightBar () {

  const [suggestions, setSuggestions] = useState([]);
  const [message, setMessage] = useState("");
  const [latestPosts, setLatestPosts] = useState([]);



  // Fetch suggestions from the server
  const fetchSuggestions = async () => {
    try {
      const res = await makeRequest.get("/users/suggestions", {
        withCredentials: true,
      });

      if (res.data.message) {
        setMessage(res.data.message); // No suggestions available
      } else {
        setSuggestions(res.data); // Ensure suggestions are set correctly
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Call the fetchSuggestions function on component mount
  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleFollow = async (userId) => {
    try {
        // Make request to follow the user
        await makeRequest.post("/relationships", { userId: userId }, {
            withCredentials: true,
        });

        // Reload the entire page to refresh it
        window.location.reload();

        // After the page reloads, display the "User followed" message for 2 seconds
        setTimeout(() => {
            setMessage("User followed");

            // Set timeout to remove the message after 2 seconds
            setTimeout(() => {
                setMessage(""); // Clear the message after 2 seconds
            }, 2000);

        }, 0);  // Set this to 0 to trigger immediately after reload

    } catch (error) {
        console.error("Error following user:", error);
    }
};


useEffect(() => {
  const fetchLatestPosts = async () => {
    try {
      const res = await makeRequest.get("/posts/latest-posts", { withCredentials: true });
      setLatestPosts(res.data);
    } catch (error) {
      console.error("Error fetching latest posts:", error);
    }
  };

  fetchLatestPosts();
}, []);


const { data: followedUsers, error, isLoading } = useQuery({
  queryKey: ["followedUsers"],
  queryFn: async () => {
    const res = await makeRequest.get("/relationships/followed-users");
    return res.data;
  },
});

if (isLoading) return <p>Loading...</p>;
if (error) return <p>Error fetching followed users!</p>;






  return (
    <div className="rightBar">
      <div className="container">
      <div className="item">
                    <span>Suggestions For You</span>
                    {message ? (
                        <p>{message}</p>
                    ) : (
                        suggestions.map((user) => (
                            <div className="user" key={user.id}>
                                <div className="userInfo">
                                    <img src={"/upload/" + user.profilePic} className="suggestionsPic" alt={user.username} />
                                    <span>{user.username}</span>
                                </div>
                                <div className="buttons">
                                    <button onClick={() => handleFollow(user.id)}>Follow</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

        <div className="item">
          <div className="latestActivities">
            <span>Latest Activities</span>
            {latestPosts.length > 0 ? (
              latestPosts.map((post, index) => (
                <div key={index} className="user">
                  <div className="userInfo">
                    <img src={`/upload/${post.profilePic}`} alt={`${post.username}'s profile`} className="suggestionsPic"/>
                    <p>
                      <span>{post.username}</span> posted: {post.desc}
                    </p>
                  </div>
                  <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                </div>
              ))
            ) : (
              <p>No recent posts</p>
            )}
          </div>
        </div>


        <div className="item">
        <span>Friends</span>
        {followedUsers?.length > 0 ? (
          followedUsers.map((user, index) => (
            <div className="user" key={index}>
              <Link to={`/profile/${user.id}`}  onClick={() => window.location.href = `/profile/${user.id}`}
            style={{ cursor: "pointer" }}>
                <img
                  src={`/upload/${user.profilePic}`}
                  alt={user.username}
                  className="suggestionsPic"
                />
                <span>{user.username}</span>
              </Link>
            </div>
          ))
        ) : (
          <p>No friends found</p>
        )}
      </div>
      </div>
    </div>
  )
}

export default RightBar