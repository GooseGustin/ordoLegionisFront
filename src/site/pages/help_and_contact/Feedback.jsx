import { NavLink } from "react-router-dom"

const Feedback = () => {
    return (
        <div>
        {/* sidebar */}
        <div className="sidebar">
            <nav className="nav flex-column">
                {/* settings  */}
                <NavLink className="nav-link" to='/praesidium'>
                    <span className="icon">
                    <i class="fa-solid fa-house"></i> 
                    </span>
                    <span className="description">Home</span>
                </NavLink>
            </nav>
        </div>

        {/* main content */}
        <div className="main-content fs-5 text-dark">
            <p>Let's make this site better to help more legionaries.</p>
            <p>To suggest any features or changes, please reach out to me at <span className="text-info">pammafeng11@gmail.com</span></p>
        </div>

        </div>
    )
}

export default Feedback
