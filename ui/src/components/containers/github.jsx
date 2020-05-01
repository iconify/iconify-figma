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

import React from 'react';
import Iconify from '@iconify/iconify';

function GitHubContainer(props) {
	let version = Iconify.getVersion(),
		majorVersion = version.split('.').shift();

	const text = {
		code:
			'<script src="https://code.iconify.design/' +
			majorVersion +
			'/' +
			version +
			'/iconify.min.js"></script>',
		codeImport: "import Iconify from '@iconify/iconify';",
		sample: '<span class="iconify" data-icon="fa-home"></span>',
		sample2:
			'<iconify-icon class="iconify" data-icon="mdi-home"></iconify-icon>',
	};

	return (
		<div className="plugin-content plugin-content--page">
			<section>
				<h1>Iconify Project</h1>
				<p>
					Iconify is not just a plug-in for Figma, it is a much bigger project.
					Every icon you can import in this plug-in can be used in HTML with
					Iconify SVG framework or with Iconify components for React, Vue and
					Svelte. Icons are always up to date, automatically updated when icon
					sets are updated by their authors.
				</p>
				<p>
					Iconify project goal is to make easy to use modern platform for
					publishing and using icons.
				</p>
				<p>
					Developers and users have access to thousands of icons instead of
					being limited to one icon set.
				</p>
				<p>
					In future icon designers will be able (this is long term plan, it is
					not ready yet) to publish custom icon sets directly from Figma. No
					need to create custom publish scripts. Iconify users will instantly
					get access to new icon sets.
				</p>

				<h2>Iconify Parts</h2>
				<p>
					Iconify project includes many smaller projects, built in various
					programming languages. Most of these projects are open source and are
					available on Iconify GitHub repository.
				</p>
				<ul>
					<li>
						Public API (2 versions: Node.js and PHP). This is where all icons
						are hosted, this is where Iconify script retrieves icons from. It is
						also used by this plug-in for searching icons. To serve icons as
						fast as possible, API is hosted on custom decentralized content
						delivery network (CDN) that consists of 7 edge servers spread out
						across the globe, without origin server.
					</li>
					<li>
						SVG framework (JavaScript, Node.js build tools). This is main script
						that is designed to replace icon fonts. See "Using Iconify in HTML"
						section below.
					</li>
					<li>
						React, Vue and Svelte components. For people who prefer to bundle
						everything instead of relying on API, there are various components.
						This is alternative to SVG framework, completely independent from
						API.
					</li>
					<li>
						Sync script (Node.js). Icons are updated automatically at least once
						a day. When authors of any icon set are publishing update, new icons
						become available on Iconify within 24 hours. Also, unlike most icon
						sets, Iconify never removes icons, so icons don't suddenly disappear
						after update.
					</li>
					<li>
						Icon finder (in development, built with Svelte). Icon finder
						component makes it easy to integrate icon search into third party
						software. It is currently in development, code for it is being
						tested on this Figma plug-in. Older version of icon finder is used
						on iconify.design website, Sketch and XenForo plugins.
					</li>
					<li>
						Figma and Sketch plug-ins (React). For now only Figma plug-in is in
						active development. Sketch plug-in uses old code.
					</li>
					<li>
						Various tools (Node.js, PHP). There are 3 GitHub repositories with
						various tools to help import/export/manipulate icons. They were
						designed for API and sync script, but can be used for other purposes
						as well.
					</li>
					<li>
						Website (PHP). It needs an update, but due to time limitations it is
						lowest priority.
					</li>
				</ul>
				<p>
					As you can see, Iconify is a very complex project with many parts.
					Figma plug-in is just one part of it.
				</p>
			</section>

			<section>
				<h1>Plug-in Future</h1>
				<p>Currently plug-in can only import icons.</p>
				<p>Plug-in is being actively developed. Planned upcoming features:</p>
				<ul>
					<li>Import custom fonts and icon sets.</li>
					<li>
						Publish icons directly from Figma to Iconify API, making it easy to
						create and publish custom icon sets. Also there will be options to
						publish everything on GitHub, make components and possibly generate
						icon fonts for people who prefer to use fonts.
					</li>
				</ul>
				<p>
					Any ideas are welcome. If you have suggestion for this plug-in, please
					open an{' '}
					<a
						href="http://github.com/iconify/iconify-figma/issues"
						target="_blank"
					>
						issue on GitHub repository
					</a>
					.
				</p>
			</section>

			<section>
				<h1>About Author</h1>
				<p>
					Iconify project, as well as this plug-in, was created by me,
					Vjacheslav Trushkin.
				</p>
				<p>
					I am a freelance full stack developer from Estonia. For more
					information visit{' '}
					<a href="https://www.linkedin.com/in/trushkin/" target="_blank">
						my Linked.in page
					</a>{' '}
					or see{' '}
					<a href="https://iconify.design/about/" target="_blank">
						about Iconify page
					</a>
					.
				</p>
				<h2>Project Maintenance</h2>
				<p>
					Iconify project is very complex, it has many parts and takes huge
					amount of time to develop and maintain.
				</p>
				<p>
					I think Iconify project has chance to become very popular modern
					replacement for icon fonts, but it will take a lot of time and effort
					to make it happen.
				</p>
				<p>
					If any company would like to help, your support will be appreciated.
					Currently I'm developing project alone, support from serious company
					could reassure customers that project is reliable, ready for
					production and is not going to suddenly disappear (it won't anyway,
					but my resources are very limited). In future my plan is to offer
					custom/premium icon sets to pay for servers and development, but that
					is a long term goal that is currently far away.
				</p>
			</section>

			<section>
				<h1>Using Iconify in HTML</h1>
				<p>
					Iconify SVG framework is a modern replacement for icon fonts. Every
					icon you can import with this plug-in is available with SVG framework.
				</p>
				<p>
					Icon fonts load big fonts and render blurred icons, but they are very
					easy to use, so they are popular.
				</p>
				<p>
					Iconify uses new innovative approach to loading icons. Unlike fonts
					and other SVG frameworks, Iconify only loads icons that are used on
					page. How is it done? By serving icons dynamically from publicly
					available JSON API (same API this plug-in uses to retrieve icons).
					Loading only icons that are used on page saves bandwidth, but most
					importantly it allows to host unlimited number of icons, offering
					massive choice of icons.
				</p>

				<h2>Usage</h2>
				<p>
					Iconify is designed to be as simple to use as icon fonts, but render
					pixel perfect SVG and offer massive choice of icons.
				</p>
				<p>
					Add this line to your page to load Iconify (you can add it to
					&lt;head&gt; section of page or before &lt;/body&gt;):
				</p>
				<div className="plugin-code-sample">{text.code}</div>
				<p>
					or, if you are building project with something like WebPack, you can
					include script by installing @iconify/iconify as dependency and
					importing it in your project:
				</p>
				<div className="plugin-code-sample">{text.codeImport}</div>

				<p>To add any icon, write something like this:</p>
				<div className="plugin-code-sample">{text.sample}</div>
				<p>or this:</p>
				<div className="plugin-code-sample">{text.sample2}</div>
				<p>
					That is it. Change data-icon value to name of icon you want to use.
				</p>
				<p>
					To change icon size or color change font-size or color in style. There
					are more options, such as transformations. See documentation.
				</p>

				<h2>Hosting</h2>
				<p>
					Iconify API is open source, so you can host everything on your servers
					if you want to. See GitHub links in resources section.
				</p>
			</section>

			<section>
				<h1>Resources</h1>
				<p>For more options check out following resources:</p>
				<ul>
					<li>
						<a href="https://iconify.design/" target="_blank">
							Iconify website
						</a>
					</li>
					<li>
						<a href="https://iconify.design/docs/" target="_blank">
							Iconify documentation
						</a>
					</li>
					<li>
						<a
							href="https://iconify.design/docs/iconify-in-pages/"
							target="_blank"
						>
							How to use Iconify in web pages
						</a>
					</li>
				</ul>
				<p>
					Iconify is open source. There are repositories on GitHub for different
					parts of project. Support is also provided at GitHub.
				</p>
				<ul>
					<li>
						<a
							href="http://github.com/iconify/iconify-figma/issues"
							target="_blank"
						>
							Figma plug-in support
						</a>
					</li>
					<li>
						<a href="http://github.com/iconify/iconify-figma" target="_blank">
							Figma plug-in repository
						</a>
					</li>
					<li>
						<a href="http://github.com/iconify/iconify" target="_blank">
							Iconify SVG framework repository
						</a>
					</li>
					<li>
						<a href="http://github.com/iconify/iconify-react" target="_blank">
							Iconify for React repository
						</a>
					</li>
				</ul>
			</section>
		</div>
	);
}

export default GitHubContainer;
