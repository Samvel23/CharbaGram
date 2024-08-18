import { useEffect, useState } from "react";
import { getAllFollowers } from "../../../helpers/api";
import { IUser } from "../../../helpers/types";
import { Link } from "react-router-dom";

export const Followers = () => {
  const [followers, setFollowers] = useState<IUser[]>([]);
  useEffect(() => {
    getAllFollowers().then((response) => {
      setFollowers(response.payload as IUser[]);
    });
  }, []);
  return (
    <>
      <h1>Followers</h1>
      {followers.map((follower) => (
        <div className="container">
          <div key={follower.id} className="follower">
            {follower.name}
          </div>
          <Link className="request-link" to={`/profile/${follower.id}`}>
            Account
          </Link>
        </div>
      ))}
    </>
  );
};
