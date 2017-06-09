export function getUriQuery(name) {
    let r = new RegExp(name + "=([^\\s=&]+)");
    let matches = location.search.match(r);
    if(matches && matches.length > 1) {
        return matches[1];
    } else {
        return '';
    }
}