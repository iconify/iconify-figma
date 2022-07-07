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
			For more details, see
			<a href="https://docs.iconify.design/" target="_blank">Iconify
				documentation
				<UIIcon icon="ext-link" /></a>.
		</p>
	</section>

	<section>
		<h1>Support</h1>
		<p>Support for plugin is provided at:</p>
		<ul>
			<li>
				<a 
					href="https://github.com/iconify/iconify-figma/issues"
					target="_blank"
				>GitHub repository for plugin <UIIcon icon="ext-link" /></a>.
			</li>
		</ul>
		
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
</PageContainer>
