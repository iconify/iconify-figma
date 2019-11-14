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
        console.log(event);
        this._diff = {
            // Difference from left top corner
            x: event.clientX - rect.x,
            y: event.clientY - rect.y,
            minX: event.screenX - event.clientX,
            minY: event.screenY - event.clientY,
            maxX: event.screenX - event.clientX + window.innerWidth,
            maxY: event.screenY - event.clientY + window.innerHeight,
        };
    }

    _onDragEnd(event) {
        event.preventDefault();
        if (this._diff === void 0) {
            return;
        }

        // Check if mouse event is inside plugin window
        if (
            event.screenX > this._diff.minX && event.screenX < this._diff.maxX &&
            event.screenY > this._diff.minY && event.screenY < this._diff.maxY
        ) {
            console.log('Dropped inside window');
            return;
        }

        // Calculate X and Y differences
        this.props.onDrag({
            x: event.clientX - (window.outerWidth / 2) + this._diff.x,
            y: event.clientY - (window.outerHeight / 2) + this._diff.y,
        });

    }
}

export default Draggable;
