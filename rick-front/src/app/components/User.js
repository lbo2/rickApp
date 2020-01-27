import React from "react";
import {Link} from "react-router";

export class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          error: null,
          isLoaded: false,
          items: [],
          isLoggedIn: false
        };
      }
    
      componentDidMount() {
        this.setState({
          isLoggedIn: (sessionStorage.getItem('token') != null ? true : false)
        });
        fetch("http://127.0.0.1:3000/getdata", {
          method: 'POST',
          body: JSON.stringify({
            token: sessionStorage.getItem('token')
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        })
          .then(res => res.json())
          .then(
            (result) => {
              console.log('resultado', result)
              this.setState({
                isLoaded: true,
                items: result.data,
                error: (result.err == true ? {message: result.response} : null)
              });
            },
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
          )
      }
    
      render() {
        const { error, isLoaded, items } = this.state;
        const style = {"margin-bottom": '2em'};
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
          return (<div className="container">
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
                      <div>Error: {error.message}</div>
                    </div>
                </div>
          </div>);
        } else if (!isLoaded) {
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
                  <div>Loading...</div>
                </div>
            </div>
          </div>);
        } else {
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
                  <ul>
                    {items.map(item => (
                      <div className="row" key={item.name} style={style}>
                          <div className="col-md-6"><img src={item.image}></img></div>
                          <div className="col-md-4">
                              <p><strong>Name:</strong> {item.name}</p>
                              <p><strong>Status:</strong> {item.status}</p>
                              <p><strong>Specie:</strong> {item.species}</p>
                              <p><strong>Gender:</strong> {item.gender}</p></div>
                      </div>
                    ))}
                  </ul>
                </div>
            </div>
          </div>);
        }
      }
}