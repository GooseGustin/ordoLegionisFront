import { Link, NavLink, useLoaderData, useNavigate } from 'react-router-dom'

const RequestDetail = () => {
    const [requestObj, legionary] = useLoaderData(); 
    const navigate = useNavigate();

    return (
        <div>
            Request detail 
            <div className="mt-5">
                {requestObj.content}
            </div>
            <div className="mt-5">
                {requestObj.date}
            </div>
        </div>
    )
}

export default RequestDetail
