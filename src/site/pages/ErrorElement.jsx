import { Link, useRouteError } from "react-router-dom"

const AuthError = (props) => {
    const {action, obj} = props; 
    const error = useRouteError();
    const code = error.status || 401;  
    // const message = error.message; 
    console.log('Fish', error.message, code, error.status, error)// , error.config.url)
    console.log("Shark", action, obj)
    const headers = {
        401: "Sorry, you are currently logged out. Your session must have ended.", 
        404: `Sorry, the ${obj} you are looking for doesn't exist.`
    }

    const reverseAction = {
        401: "log back in", 
        404: 'return to the'
    }

    const reverseLink = {
        401: "/account/login", 
        404: "/"
    }

    const reverseText = {
        401: "here", 
        404: "home page"
    }

    console.log("In the auth error handle page")
    return (
        <div className="pt-5">
            <h4 className="pt-5">{headers[code]}</h4>
            <p>Please {reverseAction[code]} <Link to={reverseLink[code]}>{reverseText[code]}</Link> to {action} {obj}</p>
        </div>
    )
}

export default AuthError
