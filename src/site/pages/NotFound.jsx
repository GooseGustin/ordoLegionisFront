import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className='mt-5'>
            <h2 className='pt-5'>404, Page not found</h2>
            <div className="text-centder mx-auto fs-5 text-dark">
            <p>The page you're looking for does not exist..</p>
            
            <p>Go back to the <Link to='/'>homepage</Link></p>
            </div>
        </div>
    )
}

export default NotFound
