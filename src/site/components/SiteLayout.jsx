import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const SiteLayout = () => {
    return (
        <div>
            <Navbar />

            <div className="container">
                <div className="row">
                    <div className="col"><Outlet /></div>
                </div>
            </div>
        </div>
    )
}

export default SiteLayout

