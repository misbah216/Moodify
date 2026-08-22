import {createBrowserRouter} from "react-router"
import Register from "./features/auth/pages/Register.jsx";
import Login from "./features/auth/pages/Login.jsx";
import Protected from "./features/auth/components/Protected"

export const router = createBrowserRouter([
    {
        path : "/",
        element : <Protected><h1>Home</h1></Protected>
    },
    {
        path : "/register",
        element : <Register/>
    },
    {
        path : "/login",
        element : <Login/>
    }
])