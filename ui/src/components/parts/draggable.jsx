"use strict";

import React, { Component } from 'react';

class Draggable extends Component {
    render() {
        let { onDrag, children, ...props } = this.props;

        return <div
            {...props}
            draggable={true}
            onDragStart={this._onDragStart.bind(this)}
            onDragEnd={this._onDragEnd.bind(this)}
        >{children}</div>
    }

    _onDragStart(event) {
        let rect = event.target.getBoundingClientRect();
        this._diff = {
            x: event.clientX - rect.x,
            y: event.clientY - rect.y
        };
    }

    _onDragEnd(event) {
        event.preventDefault();
        if (this._diff === void 0) {
            return;
        }

        this.props.onDrag({
            x: event.clientX - (window.outerWidth / 2) + this._diff.x,
            y: event.clientY - (window.outerHeight / 2) + this._diff.y,
        });
    }
}

export default Draggable;
