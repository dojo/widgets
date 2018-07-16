const escapeRegExpPattern = /[[\]{}()|\/\\^$.*+?]/g;
const escapeXmlPattern = /[&<]/g;
const escapeXmlForPattern = /[&<>'"]/g;
const escapeXmlMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};
/**
 * Escapes a string so that it can safely be passed to the RegExp constructor.
 * @param text The string to be escaped
 * @return The escaped string
 */
export function escapeRegExp(text) {
    return !text ? text : text.replace(escapeRegExpPattern, '\\$&');
}
/**
 * Sanitizes a string to protect against tag injection.
 * @param xml The string to be escaped
 * @param forAttribute Whether to also escape ', ", and > in addition to < and &
 * @return The escaped string
 */
export function escapeXml(xml, forAttribute = true) {
    if (!xml) {
        return xml;
    }
    const pattern = forAttribute ? escapeXmlForPattern : escapeXmlPattern;
    return xml.replace(pattern, function (character) {
        return escapeXmlMap[character];
    });
}
//# sourceMappingURL=stringExtras.mjs.map