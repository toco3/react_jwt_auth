import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useNavigate, useLocation, Link} from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';

const AllCourses = () => {
    const [allcourses, setAllcourses] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getCourses = async () => {
            try {
                const response = await axiosPrivate.get('/courses/all', {
                    signal: controller.signal
                });
                console.log(response.data);
                isMounted && setAllcourses(response.data);
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
            <h1>All Courses</h1>
            <br />
            {allcourses?.length
                ? (
                    <ul>
                        {allcourses.map((course, i) => <li key={i}>
                            <img src={course?.teaserimageScaled}/>
                            <br/>
                            {course?.title}
                            <br/>
                            <ReactMarkdown
                            className="ce-bodytext"
                            children={course?.description}
                            rehypePlugins={[rehypeRaw]}
                        />
                            <br/>
                            {course?.access ?  (
                                <span>access</span>
                            ) : (
                                <span>no access</span>
                            )
                            }
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

export default AllCourses
