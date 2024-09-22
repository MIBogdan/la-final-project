import "./home.scss";

import Posts from "../../components/posts/Posts";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import Share from "../../components/share/Share"


function Home () {

  const {currentUser} = useContext(AuthContext)

  
  return (
    <div className="home">

      {currentUser.id === 0 ? null : <Share />}
      <Posts />
    </div>
  )
}

export default Home;