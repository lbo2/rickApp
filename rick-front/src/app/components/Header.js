import React from "react";
import {Link} from "react-router";

export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            token: '',
            error: null,
            isLoggedIn: false
        };
    }

    componentDidMount() {
        if(sessionStorage.getItem('token')) {
            this.setState({
                isLoggedIn: true
            });
        }
    }


    render() {

        return (
            <nav className="navbar navbar-default">
                <div className="container">
                    <div className="navbar-header">
                        <ul className="nav navbar-nav">
                            <li><Link to={"/home"} activeClassName={"active"}>Login</Link></li>
                            <li><Link to={"/register"} activeClassName={"active"}>Register</Link></li>
                            <li><Link to={"/user"} activeClassName={"active"}>User</Link></li>
                            <li><Link to={"/home/logout"} activeClassName={"active"}>Logout</Link></li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}