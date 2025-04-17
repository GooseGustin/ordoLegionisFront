import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useLoaderData } from 'react-router-dom';

const BASEURL = "http://localhost:8000/api/";

const Answer = ({ answersList, user, question }) => {

    // console.log("in answers", answersList); 
    // let answersArray = answersList; 

    const [answers, setAnswers] = useState(answersList);

    const [answer, setAnswer] = useState({
        content: '', 
        creator_name: user.username, 
        question: question.id
    }); 

    useEffect(() => {
        const getAnswers = async () => {
            try {
                const token = localStorage.getItem('access'); 
                if (token) {
                    const config = {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    };
                    const answersResponse = await axios.get(BASEURL+`social/answers/?qid=${question.id}`, config);
                    setAnswers(answersResponse.data);
                }
            } catch (err) {
                console.log(err); 
            }
        }; 
        getAnswers();
    }, [answers])

    const handleChange = (e) => {
        setAnswer({
            ...answer, 
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("In form submit", answers, answer); 
        try {
            const token = localStorage.getItem('accessToken'); 
            if (token) {
                const config = {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                };
                console.log("in handle submit, answers", answer); 
                const answerResponse = await axios.post(BASEURL+'social/answers/', answer, config);
                let answersCopy = answers; 
                answersCopy.unshift(answerResponse.data)
                // answersArray = answersCopy; 
                setAnswers(answersCopy);
                // Reset
                setAnswer({
                    ...answer, 
                    content: ''
                });
                console.log("Successfully answered")
            }
        } catch (err) {
            console.log(err); 
        }
        
    }

    // let answersArray = answers;
    // console.log("Answers and array", answers, answersArray.reverse());

    return (
        <div>
            {/* Form */}
            <div className="row mt-4">
                <div className="col">
                    <form onSubmit={handleSubmit}>
                        <textarea 
                            name="content" rows="3"
                            className='form-control'
                            placeholder='Answer...'
                            value={answer.content}
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
            {/* Answer List */}
            <div className="row row-cols-1 borer mt-4 p-3 rounded rounded-4 ">
                {/* Loop through answers */}
                {
                    answers.reverse().map(item => {
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

export default Answer
