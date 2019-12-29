/**
 * This file is part of the @iconify/icon-finder package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * For the full copyright and license information, please view the license.txt or license.gpl.txt
 * files that were distributed with this source code.
 *
 * Licensed under Apache 2.0 or GPL 2.0 at your option.
 * If derivative product is not compatible with one of licenses, you can pick one of licenses.
 *
 * @license Apache 2.0
 * @license GPL 2.0
 */
'use strict';

import React, { Component } from 'react';

import Icon from '../parts/icon-decoration';

const phrases = require('../../data/phrases');
const lang = phrases.navigation;

// Delay for error message
const delay = 2500;

class Navigation extends Component {
	constructor(props) {
		super(props);

		let section = 'import';
		switch (props.route.page) {
			case 'github':
				section = 'github';
				break;

			case 'options':
				section = 'menu';
				break;
		}

		this.state = {
			time: 0,
			error: false,
			section: section,
		};
	}

	render() {
		let error = this.state.error ? <span>{lang.notavailable}</span> : null,
			route = this.props.route,
			section = this.state.section,
			inactiveClass = 'plugin-nav',
			activeClass = 'plugin-nav plugin-nav--selected',
			showCode = false,
			secondaryMenu = null;

		// Check if code tab should be visible
		if (route.page === 'code' || route.code) {
			showCode = true;
			section = route.page === 'code' ? 'code' : section;
		}

		// Do not show secondary menu if code is active
		switch (section) {
			case 'menu':
				secondaryMenu = this.renderOptions();
				break;

			case 'import':
				secondaryMenu = this.renderImport();
				break;

			case 'github':
				secondaryMenu = this.renderGitHub();
				break;
		}

		return (
			<div
				className={
					'plugin-header' +
					(secondaryMenu
						? ' plugin-header--with-menu'
						: ' plugin-header--no-menu')
				}
			>
				<div className="plugin-wrapper-header plugin-wrapper-header--primary">
					<div className="plugin-header-left">
						<a
							className={
								(section === 'menu' ? activeClass : inactiveClass) +
								' plugin-nav--icon'
							}
							href="#"
							onClick={this.onChangeSectionAndPage.bind(
								this,
								'menu',
								'options'
							)}
							title={lang.menu}
						>
							<Icon name="menu" />
						</a>
						<a
							className={section === 'import' ? activeClass : inactiveClass}
							href="#"
							onClick={this.onChangeSectionAndPage.bind(
								this,
								'import',
								'iconify'
							)}
						>
							{lang.import}
						</a>
						{showCode && (
							<a
								className={section === 'code' ? activeClass : inactiveClass}
								href="#"
								onClick={this.onChangePage.bind(
									this,
									route.page === 'code' ? route.code.page : 'code'
								)}
							>
								{lang.code}
							</a>
						)}
					</div>
					<div className="plugin-header-center">{error}</div>
					<div className="plugin-header-right">
						<a
							className={section === 'github' ? activeClass : inactiveClass}
							href="#"
							onClick={this.onChangeSectionAndPage.bind(
								this,
								'github',
								'github'
							)}
						>
							{lang.about}
						</a>
					</div>
				</div>
				{secondaryMenu}
			</div>
		);
	}

	/*
	 * Render main sub-menu
	 *
	 * @return {*}
	 */
	renderOptions() {
		let inactiveClass = 'plugin-nav';

		return (
			<div className="plugin-wrapper-header plugin-wrapper-header--secondary">
				<div className="plugin-header-left">
					{this.renderPageLink('options', lang.options)}
					{/*{this.renderPageLink('options/import', lang.importOptions)}*/}
					{/*{this.renderPageLink('options/export', lang.exportOptions)}*/}
				</div>
				<div className="plugin-header-center" />
				<div className="plugin-header-right">
					<a
						className={inactiveClass}
						href="#"
						onClick={this.onResetRoutes.bind(this)}
					>
						{lang.reset}
					</a>
				</div>
			</div>
		);
	}

	/**
	 * Render import sub-menu
	 *
	 * @return {*}
	 */
	renderImport() {
		let route = this.props.route,
			page = route.page;

		return (
			<div className="plugin-wrapper-header plugin-wrapper-header--secondary">
				<div className="plugin-header-left">
					{this.renderPageLink('iconify', lang.importIconify)}
					{this.renderPageLink('paste', lang.importSVG)}

					{/*{this.renderPageLink('font', lang.importFont)}*/}
				</div>
				<div className="plugin-header-center" />
				<div className="plugin-header-right">
					{this.renderPageLink('recent', lang.recent)}
					{/*{this.renderPageLink('bookmarks', lang.bookmarks)}*/}
				</div>
			</div>
		);
	}

	/**
	 * Render GitHub sub-menu
	 *
	 * @return {*}
	 */
	renderGitHub() {
		return (
			<div className="plugin-wrapper-header plugin-wrapper-header--secondary">
				<div className="plugin-header-left">
					{this.renderPageLink('github', lang.aboutMain)}
				</div>
				<div className="plugin-header-center" />
				<div className="plugin-header-right">
					{this.renderExternalLink(
						'http://github.com/iconify/iconify-figma',
						lang.pluginRepo
					)}
					{this.renderExternalLink(
						'http://github.com/iconify/iconify-figma/issues',
						lang.support
					)}
				</div>
			</div>
		);
	}

	/**
	 * Render page link
	 *
	 * @param {string} page
	 * @param {string} text
	 * @return {*}
	 */
	renderPageLink(page, text) {
		let className = 'plugin-nav';
		if (this.props.route.page === page) {
			className += ' plugin-nav--selected';
		} else if (!this.props.container.hasContainer(page)) {
			className += ' plugin-nav--dev';
		}
		return (
			<a
				className={className}
				href="#"
				onClick={this.onChangePage.bind(this, page)}
			>
				{text}
			</a>
		);
	}

	/**
	 * Render external link
	 *
	 * @param url
	 * @param text
	 * @return {*}
	 */
	renderExternalLink(url, text) {
		return (
			<a className="plugin-nav plugin-nav--external" href={url} target="_blank">
				{text}
				<Icon name="ext-link" />
			</a>
		);
	}

	/**
	 * Component has mounted
	 */
	componentDidMount() {
		this.mounted = true;
	}

	/**
	 * Clear timer for error message
	 */
	componentWillUnmount() {
		this.mounted = false;
		if (this.timer) {
			window.clearInterval(this.timer);
		}
	}

	/**
	 * Change visible section
	 *
	 * @param {string} section
	 * @param event
	 */
	onChangeSection(section, event) {
		event.preventDefault();

		this.setState({
			section: section,
		});
	}

	/**
	 * Change page
	 *
	 * @param {string} page
	 * @param event
	 */
	onChangePage(page, event) {
		event.preventDefault();

		let container = this.props.container;
		if (container.hasContainer(page)) {
			switch (page) {
				case 'code':
					// Save current page for return link
					if (!container.route.code) {
						return;
					}
					if (container.route.page !== 'code') {
						container.route.code.page = container.route.page;
					}
					break;
			}

			container.changePage(page);
		} else {
			this._triggerError();
		}
	}

	/**
	 * Change section and page
	 *
	 * @param section
	 * @param page
	 * @param event
	 */
	onChangeSectionAndPage(section, page, event) {
		this.onChangePage(page, event);
		this.setState({
			section: section,
		});
	}

	/**
	 * Reset routes
	 */
	onResetRoutes(event) {
		this.props.container.resetPlugin();
		this.onChangeSectionAndPage('import', 'iconify', event);
	}

	/**
	 * Show error message for 5 seconds
	 *
	 * @private
	 */
	_triggerError() {
		// Show error message for 2.5 seconds
		let time = Date.now() + delay;

		if (this.timer) {
			window.clearInterval(this.timer);
		}
		this.timer = setTimeout(() => {
			if (this.state.time === time) {
				this.timer = null;
				if (this.mounted) {
					this.setState({
						error: false,
						time: 0,
					});
				}
			}
		}, delay);

		this.setState({
			error: true,
			time: time,
		});
	}
}

export default Navigation;
