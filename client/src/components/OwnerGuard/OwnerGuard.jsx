import { Navigate, Outlet, useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";

export default function OwnerGuard() {
  const { currentUser } = useUser();
  const { id } = useParams(); 

  if (String(currentUser.id) !== String(id)) {
    return <Navigate 
             to="/home" 
             replace 
             state={{ error:"You do not have permission to access another user's content."}} 
           />;
  }

  return <Outlet />;
}