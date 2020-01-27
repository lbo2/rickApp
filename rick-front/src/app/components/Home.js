import React from "react";
import { browserHistory } from "react-router";
import {Link} from "react-router";
import PropTypes from 'prop-types';

export class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            token: '',
            error: null,
            isLoggedIn: false
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if(this.props.route.path == 'home/logout') {
            sessionStorage.clear();
        }
        this.setState({
            isLoggedIn: (sessionStorage.getItem('token') != null ? true : false)
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
          [name]: value
        });
    }

    handleSubmit(event) {

        console.log('A name was submitted: ', this.state);
        fetch("http://127.0.0.1:3000/user/login", {
          method: 'POST',
          body: JSON.stringify({
              email: this.state.email,
              password: this.state.password
          }),
          headers: {
              "Content-type": "application/json; charset=UTF-8"
          }
    })
        .then(res => res.json())
        .then(
          (result) => {
              console.log('result', result)
            if(!result.err) {
                this.setState({
                    token: result.token
                });
                sessionStorage.setItem('token', this.state.token);
                browserHistory.push("/user");
            } else {
                this.setState({
                    error: true
                })
            }
          },
          (error) => {
            console.log('error')
            this.setState({
              error
            });
          }
        )
        event.preventDefault();
    }

    render() {
        const error = this.state.error;
        const style = {"margin-bottom": '2em'};
        let button;
        let navs;
        if(this.state.isLoggedIn){
          navs = (
            <ul className="nav navbar-nav">
              <li><Link to={"/home/logout"} activeClassName={"active"}>Logout</Link></li>
            </ul>
          );
        } else {
          navs = (
            <ul className="nav navbar-nav">
              <li><Link to={"/home"} activeClassName={"active"}>Login</Link></li>
              <li><Link to={"/register"} activeClassName={"active"}>Register</Link></li>
            </ul>
          );
        }
        if (error) {
            button = <p>Email and passwors incorrect</p>;
        } else {
            button = <p></p>;
        }
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-10 col-xs-offset-1">
                        <nav className="navbar navbar-default">
                            <div className="container">
                                <div className="navbar-header">
                                    {navs}
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-xs-10 col-xs-offset-1">
                        <form onSubmit={this.handleSubmit}>
                            <h2 style={style}>Login</h2>
                            <div className="row" style={style}>
                                <label className="col-md-2">Email:</label>
                                <input className="col-md-3" type="email" name="email" value={this.state.email} onChange={this.handleInputChange} />
                            </div>
                            <div className="row" style={style}>
                                <label className="col-md-2">Password:</label>
                                <input className="col-md-3" type="password" name="password" value={this.state.password} onChange={this.handleInputChange} />
                            </div>
                            <div className="row">
                                <input type="submit" value="Login" className="btn btn-primary col-md-2"/>
                                {button}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
        );
    }
}
Home.propTypes = {
    route: PropTypes.string.isRequired,
};