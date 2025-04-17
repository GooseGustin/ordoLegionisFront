import axios from "axios"
import { useLoaderData, useNavigate } from "react-router-dom"
import { NavLink, Link } from "react-router-dom";

const BASEURL = "http://localhost:8000/api/";

const QuestionList = () => {
    const questions = useLoaderData();
    console.log('questions', questions);

    return (
        <div>

            {/* sidebar */}
            <div className="sidebar">
                <nav className="nav flex-column">
                    <NavLink className="nav-link" to='create'>
                        <span className="icon">
                            <i className="fa-solid fa-right-from-bracket fa-lg"></i> 
                        </span>
                        <span className="description">New question</span>
                    </NavLink>

                    {/* settings  */}
                    <NavLink className="nav-link" to=''>
                        <span className="icon">
                            <i className="bi bi-gear"></i>
                            <i className="fa-solid fa-right-from-bracket fa-lg"></i>
                        </span>
                        <span className="description">Help</span>
                    </NavLink>

                    {/* contact  */}
                    <NavLink className="nav-link" to=''>
                        <span className="icon">
                            <i className="bi bi-gear"></i>
                            <i className="fa-solid fa-right-from-bracket fa-lg"></i>
                        </span>
                        <span className="description">Contact</span>
                    </NavLink>
                </nav>
            </div>

            {/* main  */}
            <main className="main-content">
                
                <div className="">
                    {questions.map(item => {
                        return (
                            <div className="card my-2 border-0" key={item.id}>

                                <div className="card-header">
                                    <Link className='text-dark text-decoration-none' to={item.id.toString()}>
                                        {/* <span className="fs-5">{item.title} <span className="fs-2">|</span> </span> */}
                                        <span className="text-info fs-6">Question </span>
                                    </Link>
                                </div>

                                <Link className='text-dark text-decoration-none' to={item.id.toString()}>
                                    <div className="card-body question rounded border border-3 border-dark">
                                        {item.content.slice(0, 120)}
                                        {item.content.length > 120 ? <>...</> : <></>}
                                    </div>
                                </Link>

                            </div>
                        );
                    }
                    )}
                </div>
            </main>
        </div>
    )
}

export default QuestionList

export const questionListLoader = async ({ params }) => {
    // const { cid } = params;
    let questions;

    // try {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const config = {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            };
            const questionsResponse = await axios.get(`${BASEURL}social/questions/`, config);
            questions = questionsResponse.data;
        } else {
            console.log('Sign in to access questions')

        }
    // } catch (err) {
    //     console.log("Error", err)
    // } finally {
        return questions
    // }

}