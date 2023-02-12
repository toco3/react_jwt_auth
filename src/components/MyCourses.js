import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useNavigate, useLocation, Link} from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';

const MyCourses = () => {
    const [mycourses, setMycourses] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getCourses = async () => {
            try {
                const response = await axiosPrivate.get('/courses/my', {
                    signal: controller.signal
                });
                console.log(response.data);
                isMounted && setMycourses(response.data);
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getCourses();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    return (
        <section>
            <h1>My Courses</h1>
            <br />
            {mycourses?.length
                ? (
                    <ul>
                        {mycourses.map((course, i) => <li key={i}>
                            <img src={course?.teaserimageScaled}/>
                            <br/>
                            {course?.title}
                            <br/>
                            <ReactMarkdown
                                className="ce-bodytext"
                                children={course?.description}
                                rehypePlugins={[rehypeRaw]}
                            />

                            <br/><br/>
                        </li>)}
                    </ul>
                ) : <p>No courses to display</p>
            }

            <div className="flexGrow">
                <Link to="/">Home</Link>
            </div>
        </section>
    )
}

export default MyCourses
