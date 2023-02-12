import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth";

const Lounge = () => {
    const { auth } = useAuth();

    return (
        <section>
            <h1>About the User</h1>
            <br />
            <p>{auth.username} </p>
            <p>{auth.firstname} {auth.lastname}</p>
            <p>{auth?.roles?.map(role => {
                return (
                   <span> { role }, </span>
                );
            })} </p>
            <div className="flexGrow">
                <Link to="/">Home</Link>
            </div>

        </section>
    )
}

export default Lounge
