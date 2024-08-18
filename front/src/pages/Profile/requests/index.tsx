import { useEffect, useState } from "react";
import { IUser } from "../../../helpers/types";
import {
  acceptRequest,
  declineRequest,
  getAllRequests,
} from "../../../helpers/api";
import { Link, useParams } from "react-router-dom";

export const Requests = () => {
  const [requests, setRequests] = useState<IUser[]>([]);
  const handleAccept = (id: number) => {
    acceptRequest(id)
      .then((response) => {
        console.log(response);
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== id)
        );
      })
      .catch((error) => console.log(error));
  };
  const handleDecline = (id: number) => {
    declineRequest(id)
      .then((response) => {
        console.log(response);
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== id)
        );
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getAllRequests()
      .then((response) => {
        setRequests(response.payload as IUser[]);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <h1>Requests</h1>
      <p>you have {requests.length} requests</p>
      {requests.map((item) => (
        <div className="container-request" key={item.id}>
          <h2>{item?.user.name}</h2>
          <Link className="request-link" to={`/profile/${item.id}`}>
            Account
          </Link>
          <div className="container-for-button">
            <button
              className="btn btn-outline-dark my-3"
              onClick={() => handleAccept(item.id)}
            >
              Accept
            </button>
            <button
              className="btn btn-outline-dark my-3"
              onClick={() => handleDecline(item.id)}
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </>
  );
};
