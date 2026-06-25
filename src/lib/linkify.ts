const URL_REGEX =
	/\bhttps?:\/\/[^\s<>\"')\]]+|\b[\w.-]+\.(?:com|org|net|io|co|dev|app|store|shop|jewelry|diamonds|gold)(?:\/[^\s<>\"')\]]*)?/gi;

const EMAIL_REGEX = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g;

const PHONE_REGEX = /(?:\+1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;

const MD_LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g;

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

/**
 * Converts plain text to HTML with clickable links.
 * Supports: markdown [text](url), auto-detected URLs, emails, and phone numbers.
 * Safe to use with `set:html` — all non-link text is HTML-escaped.
 */
export function linkify(text: string): string {
	if (!text) return '';

	const combined = new RegExp(
		`(${MD_LINK_REGEX.source})|(${EMAIL_REGEX.source})|(${PHONE_REGEX.source})|(${URL_REGEX.source})`,
		'gi',
	);

	let result = '';
	let lastIndex = 0;

	for (const match of text.matchAll(combined)) {
		const matchStart = match.index!;
		result += escapeHtml(text.slice(lastIndex, matchStart));

		const [full, mdFull, mdText, mdUrl, email, phone] = match;

		if (mdFull) {
			const href = /^https?:\/\//i.test(mdUrl)
				? mdUrl
				: /^[/]|^mailto:|^tel:/.test(mdUrl)
					? mdUrl
					: `https://${mdUrl}`;
			const isExternal = /^https?:\/\//i.test(href);
			result += `<a href="${escapeHtml(href)}"${isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''} class="text-secondary hover:underline">${escapeHtml(mdText)}</a>`;
		} else if (email) {
			result += `<a href="mailto:${escapeHtml(email)}" class="text-secondary hover:underline">${escapeHtml(email)}</a>`;
		} else if (phone) {
			const digits = full.replace(/\D/g, '');
			result += `<a href="tel:${digits}" class="text-secondary hover:underline">${escapeHtml(full)}</a>`;
		} else {
			const href = full.match(/^https?:\/\//i) ? full : `https://${full}`;
			result += `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" class="text-secondary hover:underline">${escapeHtml(full)}</a>`;
		}

		lastIndex = matchStart + full.length;
	}

	result += escapeHtml(text.slice(lastIndex));

	return result;
}
