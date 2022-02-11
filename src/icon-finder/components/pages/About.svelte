<script lang="typescript">
	import PageContainer from './parts/PageContainer.svelte';
	import UIIcon from '../ui/UIIcon.svelte';
	import { externalLinks } from '../../figma/navigation';
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

		<section>
			<h1 class="around-logo">
				<UIIcon icon="icon-finder-theme:around" />
			</h1>
			<p>
				Huge thanks to
				<a href={externalLinks.around} target="_blank">Around</a>
				for sponsoring Iconify!
			</p>
			<p>
				<a href={externalLinks.around} target="_blank">Try Around</a>
				for video calls. Designed for developers! Oh... and Around team
				uses Figma!
			</p>
		</section>

		<p>You can contribute too!</p>

		<p>
			Iconify is open source, servers and development costs money. It is a
			big project, which requires full time development. Iconify needs
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

		<p>
			Check out
			<a href="https://iconify.design/" target="_blank">Iconify website
				<UIIcon icon="ext-link" /></a>
			to learn about Iconify and
			<a href="https://iconify.design/about/" target="_blank">page about
				Iconify
				<UIIcon icon="ext-link" /></a>
			to see project goals.
		</p>
	</section>

	<section>
		<h1>Support</h1>
		<p>
			Support for plugin is provided at
			<a
				href="https://github.com/iconify/iconify-figma/issues"
				target="_blank">GitHub repository for plugin
				<UIIcon icon="ext-link" /></a>.
		</p>
	</section>
</PageContainer>
