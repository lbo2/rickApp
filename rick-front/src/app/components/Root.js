import React from "react";
import PropTypes from 'prop-types';

export class Root extends React.Component {
    render() {
        return (
            <div className="container">
                        {this.props.children}
            </div>
        );
    }
}
Root.propTypes = {
    children: PropTypes.string.isRequired,
};