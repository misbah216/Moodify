import React from 'react';
import '../style/login.scss';
import FormGroup from "../components/FormGroup"
import {Link} from 'react-router'

const Login = () => {
    return (
       <main className= "login-page">
        <div className="form-container">
            <h1>Login</h1>
            <form>
               <FormGroup label ="Email" placeholder="Enter Your email" />
               <FormGroup label ="Password" placeholder="Enter your password" />
                <button className="button" type="submit">Login</button>
            </form>
            <p>New user? <Link to="/register">Register</Link></p>
        </div>
       </main>
    );
};

export default Login;


