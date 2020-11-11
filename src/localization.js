export async function getLocalizeResources(langs) {

	let translations;
	for await (const lang of langs) {
		switch (lang) {
			case 'en':
				translations = await import('../lang/en.js');
				break;
		}
		if (translations && translations.default) {
			return {
				language: lang,
				resources: translations.default
			};
		}
	}
	translations = await import('../lang/en.js');
	return {
		language: 'en',
		resources: translations.default
	};
}
