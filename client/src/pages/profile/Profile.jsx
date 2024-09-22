import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import "./profile.scss";
import { AuthContext } from '../../context/authContext';
import PlaceIcon from "@mui/icons-material/PlaceOutlined";
import LanguageIcon from "@mui/icons-material/LanguageOutlined";
import Posts from "../../components/posts/Posts";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { makeRequest } from "../../axios.js"
import Update from '../../components/update/Update';
import guestPic from "../../assets/guest.png"

function Profile () {

  const [openUpdate, setOpenUpdate] = useState(false)

  const {currentUser} = useContext(AuthContext)

  const userId = parseInt(useLocation().pathname.split("/")[2])

  const { isLoading, error, data } = useQuery({
    queryKey: ['user'],
    queryFn: () =>
      makeRequest.get('/users/find/' + userId).then((res) => {return res.data}),
  });

  const { isLoading: rIsLoading, data: relationshipData } = useQuery({
    queryKey: ['relationship'],
    queryFn: () =>
      makeRequest.get('/relationships?followedUserId=' + userId).then((res) => {return res.data}),
  });

  const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (following) => {if (following) return makeRequest.delete("/relationships?userId=" + userId)
            return makeRequest.post("/relationships", {userId})
        },
        onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ['relationship'] })
        },
    })


    const handleFollow = () => {
        mutation.mutate(relationshipData.includes(currentUser.id))
    }

    

  return (
    <div className='profile'>
     {isLoading ? "Loading..." : <><div className="images">
        <img src={data.coverPic? "/upload/" + data.coverPic : guestPic} alt="" className='cover'/>
        <img src={data.profilePic ? "/upload/" + data.profilePic : guestPic} alt="" className='profilePic'/>
      </div>

      <div className="profileContainer">
        <div className="uInfo">
          
          <div className="center">
            <span>{data.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{data.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data.website}</span>
              </div>
            </div>
            {rIsLoading ? "Loading relationships..." : userId === currentUser.id 
            ? <button onClick={() => setOpenUpdate(true)}>update</button>
            : <button onClick={handleFollow}>{relationshipData.includes(currentUser.id) ? "Following" : "Follow"}</button>}
          </div>
          
        </div>
      <Posts userId={userId}/>
      </div> </>}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data}/>}
    </div>
  )
}

export default Profile;
