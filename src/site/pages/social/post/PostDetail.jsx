import axios from 'axios';
import { Link, NavLink, useLoaderData, useNavigate } from 'react-router-dom'
import Comment from './Comment';

const BASEURL = 'http://localhost:8000/api/';

const PostDetail = () => {
    const [postObj, user, comments] = useLoaderData();
    console.log("in post detail", postObj);

    const [datePart, rest] = postObj.date.split('T'); 
    const [time, _] = rest.split('.');
    const postDate = new Date(datePart.split('-')).toDateString();

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
                        <span className="description">New post</span>
                    </NavLink>
                    <NavLink className="nav-link" to='../'>
                        <span className="icon">
                            <i className="fa-solid fa-right-from-bracket fa-lg"></i> 
                        </span>
                        <span className="description">My posts</span>
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
                <div className="row my-2 text-dark">
                    <div className="col">
                        Post by <span className='text-info'>{user.username}</span>
                    </div>
                    <div className="col text-end">
                        <span className="text-info">{postDate}, {time}</span>
                    </div>
                    {/* <span className="fs-2">{postObj.title}</span> */}
                </div>
                <div className="row my-2 text-dark text-center">
                    <span className="display-6">
                    {postObj.title}
                    </span>
                </div>

                <div className="row">
                    <div className="col text-center">
                    <img src={postObj.image} alt="" />
                    </div>
                </div>

                <div className="row p-3 fs-4">
                    {postObj.content}
                </div>
                <hr />
                
                {/* Comments */}
                <div className="comments">
                    <Comment commentsList={comments} user={user} post={postObj} />
                </div>
            </main>
        </div>
    )
}

export default PostDetail


export const postDetailLoader = async ({ params }) => {
    const { id } = params; // id of post for edit 
    const loc = 'In post detail loader'; 
    
    let obj, user, comments; 
    // try {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const config = {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            };
            console.log(loc, 'id', id); 
            if (id) {
                const response = await axios.get(BASEURL + `social/posts/${id}`, config);
                obj = response.data; 

                const commentsResponse = await axios.get(BASEURL + `social/comments/?pid=${obj.id}`, config);
                comments = commentsResponse.data; 
                // console.log("Gotten comments", comments); 
                if (!comments) {
                    throw new Error("Answers not obtained")
                }
                console.log('In post form loader, post', obj, comments); // obj
            }

            const userResponse = await axios.get(BASEURL + 'accounts/user', config); 
            user = userResponse.data;
            console.log('user', user, comments)
        } else {
            console.log("Sign in to get posts")
        }
    // } catch(err) {
    //     if (err.status === 401) {
    //         console.log("The session is expired. Please sign in again to view posts")
    //     } else {
    //         console.error("Error fetching post:", err);
    //     }
    // }
    // console.log('Comments....', comments)
    return [obj, user, comments];
}

