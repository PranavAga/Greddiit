import { Link } from "react-router-dom";

export default function Error(){
    return(
        <><h1>Error :/</h1>
        Go to home page <Link to={'/'}>Your Profile</Link>
        </>
    )
}