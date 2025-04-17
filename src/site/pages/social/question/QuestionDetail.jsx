import axios from 'axios';
import { Link, NavLink, useLoaderData, useNavigate } from 'react-router-dom'
import Answer from './Answer';

const BASEURL = 'http://localhost:8000/api/';

const QuestionDetail = () => {
    const [questionObj, user, answers] = useLoaderData(); 
    // const navigate = useNavigate();
    
    const [datePart, rest] = questionObj.date.split('T'); 
    const [time, _] = rest.split('.');
    const questionDate = new Date(datePart.split('-')).toDateString();

    console.log('Answers', answers); 
    console.log("user", user); 
    console.log('question', questionObj); 
    
    return (
        <div>
        {/* sidebar */}
        <div className="sidebar">
            <nav className="nav flex-column">
                <NavLink className="nav-link" to='edit'>
                    <span className="icon">
                        <i className="fa-solid fa-right-from-bracket fa-lg"></i> 
                    </span>
                    <span className="description">Edit</span>
                </NavLink>
                <NavLink className="nav-link" to='../create'>
                    <span className="icon">
                        <i className="fa-solid fa-right-from-bracket fa-lg"></i> 
                    </span>
                    <span className="description">New question</span>
                </NavLink>
                <NavLink className="nav-link" to='../'>
                    <span className="icon">
                        <i className="fa-solid fa-right-from-bracket fa-lg"></i> 
                    </span>
                    <span className="description">My questions</span>
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

        {/* main-content */}
        <main className="main-content text-dark">
            {/* Question */}
            <div className="row my-2 text-dark">
                <div className="col">
                    Question by <span className='text-info'>{questionObj.creator_name}</span>
                </div>
                <div className="col text-end">
                    <span className="text-info">{questionDate}, {time}</span>
                </div>
                {/* <span className="fs-2">{questionObj.title}</span> */}
            </div>
            <hr />

            <div className="row p-3 fs-4">
                {questionObj.content}
            </div>

            {/* Answers */}
            <div className="answers">
                <Answer answersList={answers} user={user} question={questionObj} />
            </div>
        </main>
            
        </div>
    )
}

export default QuestionDetail


export const questionDetailLoader = async ({ params }) => {
    const { id } = params; // id of question for edit 
    
    let obj, user, answers; 
    // try {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const config = {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            };
            if (id) {
                const response = await axios.get(BASEURL + `social/questions/${id}`, config);
                obj = response.data; 

                const answersResponse = await axios.get(BASEURL + `social/answers/?qid=${obj.id}`, config);
                answers = answersResponse.data; 
                // console.log("Gotten answers", answers); 
                if (!answers) {
                    throw new Error("Answers not obtained")
                }
                console.log('In question form loader, question', obj); // obj
            }

            const userResponse = await axios.get(BASEURL + 'accounts/user', config); 
            user = userResponse.data;
            console.log('user', user, answers)
        } else {
            console.log("Sign in to get questions")
        }
    // } catch(err) {
    //     if (err.status === 401) {
    //         console.log("The session is expired. Please sign in again to view praesidia")
    //     } else {
    //         console.error("Error fetching curia:", err);
    //     }
    // }
    // console.log('Answers....', answers)
    return [obj, user, answers];
}

