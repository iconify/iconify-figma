"use strict";

import React from 'react';

import Notice from './notice';

function FloatingNotices(props) {
    let notices = [];

    props.notices.forEach(notice => {
        let time = notice.time;

        notices.push(<Notice
            key={time}
            type={notice.type}
            className={'plugin-notice--floating plugin-notice--' + notice.expiration}
            onClick={event => {
                event.preventDefault();
                props.onDelete(time);
            }}
        >{notice.message}</Notice>);
    });

    if (!notices.length) {
        return null;
    }

    return <div className="plugin-floating-notice">
        {notices}
    </div>;
}

export default FloatingNotices;
