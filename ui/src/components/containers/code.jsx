"use strict";

import React from 'react';

import PluginBlock from '../parts/plugin-block';
import ParentBlock from '../parts/parent-block';
import HTMLCodeBlock from '../parts/code/html';
import ReactCodeBlock from '../parts/code/react';

const phrases = require('../../data/phrases');
const iconObject = require('../../core/objects/icon');
const lang = phrases.code;

function CodeContainer(props) {
    let container = props.container,
        route = container.route.code,
        prevPage = route.page,
        prevPageTitle = lang.return[prevPage] === void 0 ? lang.return.default : lang.return[prevPage];

    // Convert route to code object
    let icon = {
        icon: iconObject(route.name),
        hasColor: !!route.color,
        color: route.node.color ? route.node.color : route.color,
        height: route.node.height,
        width: route.node.width,
        hFlip: !!route.props.hFlip,
        vFlip: !!route.props.vFlip,
        rotate: route.props.rotate ? parseInt(route.props.rotate) : 0,
    };

    return <div className="plugin-content plugin-content--page">
        <ParentBlock parents={[{
            onClick: event => {
                event.preventDefault();
                container.changePage(prevPage);
            },
            title: prevPageTitle,
        }]} />

        <PluginBlock type="code">
            <h1>{lang.pageTitle.replace('{name}', route.node.name)}</h1>
            <p>{lang.pageExplain}</p>
            <p>{lang.pageExplain2}</p>

            <section>
                <h2>{lang.htmlTitle}</h2>
                <HTMLCodeBlock icon={icon} />
            </section>

            <section>
                <h2>{lang.reactTitle}</h2>
                <ReactCodeBlock icon={icon} />
            </section>

            {container.options.showCodePage && <p>{lang.pageExplain3}</p>}
        </PluginBlock>
    </div>
}

export default CodeContainer;
