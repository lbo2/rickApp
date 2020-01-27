import React from "react";
import {render} from "react-dom";
import {Router, Route, browserHistory, IndexRoute} from "react-router";

import {Root} from "./components/Root";
import {Home} from "./components/Home";
import {User} from "./components/User";
import {Register} from "./components/register";

class App extends React.Component {
    componentDidMount() {
        console.log('se carga pagina')
    }
    render() {
        return (
            <Router history={browserHistory}>
                <Route path={"/"} component={Root} >
                    <IndexRoute component={Home} />
                    <Route path={"user"} component={User} />
                    <Route path={"home"} component={Home} />
                    <Route path={"register"} component={Register} />
                    <Route path={"home/logout"} component={Home} />
                </Route>
                <Route path={"home-single"} component={Home}/>
            </Router>
        );
    }
}

render(<App />, window.document.getElementById('app'));