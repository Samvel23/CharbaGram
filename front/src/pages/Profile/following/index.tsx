import { useEffect, useState } from "react";
import { getAllFollowings } from "../../../helpers/api";
import { IUser } from "../../../helpers/types";
import { Link } from "react-router-dom";

export const Following = () => {
    const [followings, setFollowings] = useState<IUser[]>([]);
  useEffect(() => {
    getAllFollowings().then((response) => {
      setFollowings(response.payload as IUser[]);
    });
  }, []);
  return (
    <>
      <h1>Followings</h1>
      {followings.length == 0 && <strong>No followings</strong>}
      {followings.map((following) => (
        <div className="container">
          <div key={following.id} className="follower">
            {following.name}
          </div>
          <Link className="request-link" to={`/profile/${following.id}`}>
            Account
          </Link>
        </div>
      ))}
    </>
  );
}