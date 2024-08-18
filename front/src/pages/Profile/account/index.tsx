import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cancelRequest, follow, getAccount, unfollow } from "../../../helpers/api";
import { IAccount } from "../../../helpers/types";
import { BASE, DEF } from "../../../helpers/default";
import { Gallery } from "../../../components/Gallery";

export const Account = () => {
  const { id } = useParams<string>(); // Ensuring id is treated as string
  const [userAccount, setUserAccount] = useState<IAccount | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getAccount(id).then((response) => {
        if (!response.payload || response.status === "error") {
          navigate("/profile");
        } else {
          setUserAccount(response.payload as IAccount);
        }
      });
    }
  }, [id, navigate]);

  const followUser = () => {
    if (userAccount?.id) {
      follow(userAccount.id).then((response) => {
        if (response.status === "following") {
          setUserAccount((prevAccount) => ({
            ...prevAccount!,
            connection: { ...prevAccount!.connection, following: true },
            followerCount: (prevAccount!.followerCount ?? 0) + 1,
          }));
        } else if (response.status === "requested") {
          setUserAccount((prevAccount) => ({
            ...prevAccount!,
            connection: { ...prevAccount!.connection, requested: true },
          }));
        }
      });
    }
  };

  const unfollowUser = () => {
    if (userAccount?.id) {
      unfollow(userAccount.id).then((response) => {
        if (response.status === "unfollowed") {
          setUserAccount((prevAccount) => ({
            ...prevAccount!,
            connection: { ...prevAccount!.connection, following: false },
            followerCount: prevAccount?.followerCount ? prevAccount!.followerCount - 1 : 0,
          }));
        }
      });
    }
  };

  const cancelFollowRequest = () => {
    if (userAccount?.id) {
      cancelRequest(userAccount.id).then((response) => {
        if (response.status === "cancelled") {
          setUserAccount((prevAccount) => ({
            ...prevAccount!,
            connection: { ...prevAccount!.connection, requested: false },
          }));
        }
      });
    }
  };

  const handleFollow = () => {
    if (userAccount) {
      if (userAccount.connection.following) {
        unfollowUser();
      } else if (userAccount.connection.requested) {
        cancelFollowRequest();
      } else {
        followUser();
      }
    }
  };

  return userAccount ? (
    <div className="container mt-5 mb-5">
      <div className="row no-gutters">
        <div className="col-md-4 col-lg-4">
          <img
            src={userAccount.picture ? BASE + userAccount.picture : DEF}
            alt="Profile"
          />
        </div>
        <div className="col-md-8 col-lg-8">
          <div className="d-flex flex-column">
            <div className="d-flex flex-row justify-content-between align-items-center p-5 bg-dark text-white">
              <h3 className="display-5">
                {userAccount.name} {userAccount.surname}
              </h3>
              <div>
                <i className="fa fa-facebook"></i>
                <i className="fa fa-google"></i>
                <i className="fa fa-youtube-play"></i>
                <i className="fa fa-dribbble"></i>
                <i className="fa fa-linkedin"></i>
              </div>
            </div>
            <div className="p-3 bg-black text-white">
              <img
                className="icon"
                src={
                  userAccount.isPrivate
                    ? "https://cdn0.iconfinder.com/data/icons/leto-ui-generic-1/64/leto-44-512.png"
                    : "https://cdn1.iconfinder.com/data/icons/unicons-line-vol-4/24/lock-open-alt-512.png"
                }
                alt="Privacy Icon"
              />
              <button
                onClick={handleFollow}
                className="btn btn-outline-primary"
              >
                {userAccount.connection.requested
                  ? "requested"
                  : userAccount.connection.followsMe
                  ? "follow back"
                  : userAccount.connection.following
                  ? "unfollow"
                  : "follow"}
              </button>
            </div>
            <div className="d-flex flex-row text-white">
              <div className="p-4 bg-primary text-center skill-block">
                <h4>{userAccount.followerCount ?? 0}</h4>
                <h6>followers</h6>
              </div>
              <div className="p-3 bg-success text-center skill-block">
                <h4>{userAccount.following?.length ?? 0}</h4>
                <h6>following</h6>
              </div>
              <div className="p-3 bg-danger text-center skill-block">
                <h4>{userAccount.posts?.length ?? 0}</h4>
                <h6>posts</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      {!userAccount.isPrivate && <Gallery posts={userAccount.posts} />}
    </div>
  ) : null;
};
