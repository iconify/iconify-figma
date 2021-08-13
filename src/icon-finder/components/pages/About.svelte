<script lang="typescript">
	import PageContainer from './parts/PageContainer.svelte';
	import UIIcon from '../ui/UIIcon.svelte';
</script>

<PageContainer type="about">
	<section>
		<h1>About Iconify</h1>
		<p>
			Iconify is an open source project, attempting to unify syntax for
			many icon sets.
		</p>
		<p>
			There are hundreds of good open source icon sets available for
			developers, but each one uses its own syntax, loads data for icons
			that are not needed. Mixing icons from various icon sets is not easy
			because they are designed to work only with tools provided by icon
			set author, or worse - as icon font.
		</p>
		<p>
			Unlike other icon sets, Iconify does not bundle thousands of icons.
			Icons are loaded on demand from public Iconify API. This means
			developers can use icons from various icon sets on the same page.
			For example, if developer wants to use few icons from
			<a
				href="https://icon-sets.iconify.design/ic/"
				target="_blank">Google Material Design Icons</a>
			and few icons from
			<a href="https://icon-sets.iconify.design/jam/" target="_blank">Jam
				Icons</a>, Iconify component will load only data for those icons
			from API, not thousands of icons.
		</p>
		<p>
			There are over 100,000 icons available for developers from over 100
			open source icon sets. All icon sets are automatically kept up to
			date, icons are validated and cleaned up.
		</p>
		<p>
			For more details, see
			<a href="https://docs.iconify.design/" target="_blank">Iconify
				documentation
				<UIIcon icon="ext-link" /></a>.
		</p>
	</section>

	<section>
		<h1>Sponsoring Iconify</h1>

		<p>
			Project is open source, it does not have commercial part. There are
			ads on website, but they barely cover server costs. Iconify needs
			your help!
		</p>

		<p>
			If you are using Iconify in your projects, please consider
			supporting Iconify.
		</p>
		<p>
			<a
				href="https://github.com/sponsors/cyberalien"
				target="_blank">Sponsorship is available via GitHub sponsors
				<UIIcon icon="ext-link" /></a>.
		</p>

		<p>Iconify is a big project, which requires full time development.</p>
		<p>Parts of project:</p>

		<section>
			<h1>
				<a
					href="https://docs.iconify.design/sources/api/"
					target="_blank">Iconify API
					<UIIcon icon="ext-link" /></a>
			</h1>
			<p>
				API is hosted on many servers, placed in different parts of the
				world to make sure visitors get icons as fast as possible.
			</p>
			<p>
				Servers cost money. Development and maintenance of API software
				requires time.
			</p>
		</section>

		<section>
			<h1>
				<a
					href="https://docs.iconify.design/sources/json/"
					target="_blank">Icon Sets
					<UIIcon icon="ext-link" /></a>
			</h1>
			<p>
				While icon sets are maintained by their authors, they need to be
				automatically updated by Iconify update script, which also
				cleans them up. That requires custom software, which takes a lot
				of time to develop and maintain.
			</p>
		</section>

		<section>
			<h1>
				<a
					href="https://docs.iconify.design/icon-components/"
					target="_blank">Icon Components
					<UIIcon icon="ext-link" /></a>
			</h1>
			<p>
				There are many websites offering huge collections of SVG. But
				they do not offer easy to use icon components. Iconify does
				provide components for various frameworks (React, Vue, Svelte)
				that load icon data dynamically from Iconify API.
			</p>
			<p>Components require a lot of time to develop and maintain.</p>
		</section>

		<section>
			<h1>
				<a
					href="https://docs.iconify.design/icon-finder/"
					target="_blank">Icon Finder
					<UIIcon icon="ext-link" /></a>
			</h1>
			<p>
				Iconify Icon Finder is an icon picker, designed to be used in
				projects such as website builders, theme customizers. This
				plugin is built on top of it.
			</p>
			<p>Icon Finder is currently in development.</p>
		</section>

		<section>
			<h1>
				<a
					href="https://docs.iconify.design/tools/"
					target="_blank">Iconify Tools
					<UIIcon icon="ext-link" /></a>
			</h1>
			<p>
				To help manage all sub-projects listed above, set of tools is
				available. It also takes a lot of time to develop and maintain.
			</p>
		</section>
	</section>

	<section>
		<h1>Support</h1>
		<p>
			Support for plugin is provided at
			<a
				href="https://github.com/iconify/iconify-figma/issues"
				target="_blank">GitHub repository for plugin</a>.
		</p>
	</section>
</PageContainer>
