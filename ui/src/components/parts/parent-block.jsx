"use strict";

import React from 'react';

import PluginBlock from './plugin-block';
import Icon from './icon-decoration';

function ParentBlock(props) {
    let items = [];
    props.parents.forEach((item, index) => {
        items.push(<a
            key={item.key ? item.key : 'parent-' + index}
            href={item.href ? item.href : '#'}
            onClick={item.onClick}
        >
            <Icon name="arrow-left"/>
            {item.title}
        </a>)
    });

    return <PluginBlock type="parent">
        {items}
    </PluginBlock>;
}

export default ParentBlock;
