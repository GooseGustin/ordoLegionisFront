import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useLoaderData } from 'react-router-dom';

const BASEURL = "http://localhost:8000/api/";

const Comment = ({ commentsList, user, post }) => {

    // console.log("in comments", commentsList); 
    // let commentsArray = commentsList; 

    const [comments, setComments] = useState(commentsList);

    const [comment, setComment] = useState({
        content: '', 
        creator_name: user.username, 
        post: post.id
    }); 

    useEffect(() => {
        const getComments = async () => {
            try {
                const token = localStorage.getItem('access'); 
                if (token) {
                    const config = {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    };
                    const commentsResponse = await axios.get(BASEURL+`social/comments/?qid=${post.id}`, config);
                    setComments(commentsResponse.data);
                }
            } catch (err) {
                console.log(err); 
            }
        }; 
        getComments();
    }, [comments])

    const handleChange = (e) => {
        setComment({
            ...comment, 
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("In form submit", comments, comment); 
        try {
            const token = localStorage.getItem('accessToken'); 
            if (token) {
                const config = {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                };
                console.log("in handle submit, comments", comment); 
                const commentResponse = await axios.post(BASEURL+'social/comments/', comment, config);
                let commentsCopy = comments; 
                commentsCopy.unshift(commentResponse.data)
                // commentsArray = commentsCopy; 
                setComments(commentsCopy);
                // Reset
                setComment({
                    ...comment, 
                    content: ''
                });
                console.log("Successfully commented")
            }
        } catch (err) {
            console.log(err); 
        }
        
    }

    // let commentsArray = comments;
    // console.log("Comments and array", comments, commentsArray.reverse());

    return (
        <div>
            {/* Form */}
            <div className="row">
                <div className="col">
                    <form onSubmit={handleSubmit}>
                        <textarea 
                            name="content" rows="3"
                            className='form-control'
                            placeholder='Comment...'
                            value={comment.content}
                            onChange={handleChange}
                        ></textarea>
                        <div className="row">
                            <div className="col-3"></div>
                            <div className="col">
                            <button className="btn mt-2 col-lg btn-outline-info rounded rounded-3">Submit</button>
                            </div>
                            <div className="col-3"></div>
                        </div>
                    </form>
                </div>
            </div>
            {/* Comment List */}
            <div className="row row-cols-1 borer mt-4 p-3 rounded rounded-4 ">
                {/* Loop through comments */}
                {
                    comments.map(item => {
                        // console.log('date', item.date)
                        
                        const [datePart, rest] = item.date.split('T'); 
                        const [time, _] = rest.split('.');
                        const date = new Date(datePart.split('-')).toDateString();

                        return (
                            <div className="col-12 my-3 border border-dark answer-box" key={item.id}>
                                <div className="row">
                                    <div className="col-5">{item.creator_name}</div>
                                    <div className="col-2"></div>
                                    <div className="col-5 text-end">
                                        <span className="answer-time-stamp">{date}, {time}</span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col text-light answer-content py-3">
                                        {item.content}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-4">
                                        <span>Upvotes {item.upvotes}</span>
                                    </div>
                                    <div className="col-4">
                                        <span>Downvotes {item.downvotes}</span>
                                    </div>
                                    <div className="col-4">
                                        <span>Flags {item.flags.length}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            
        </div>
    )
}

export default Comment
