onmessage = event => {
  importScripts('../highlight/highlight.pack.js');
  importScripts('./prettier.js');
  importScripts('./parser-babylon.js');
  const text = event.data;
  let parts = text.split(/\n/g);
  parts = filterInitialEmptyLines(parts);
  parts = filterInitialEmptyLines(parts.reverse()).reverse();
  const code = prettier.format(normalizeTabs(parts), {
    parser: 'babel',
    plugins: prettierPlugins,
  });
  const result = self.hljs.highlightAuto(code);
  postMessage(result.value);
};

function filterInitialEmptyLines (parts) {
  let found = false;
  return parts.filter(p => {
    if (!found) {
      if (p.trim().length === 0) {
        return false;
      }
    }
    found = true;
    return true;
  });
}

function normalizeTabs (parts) {
  let shortestSpaces = '';
  return parts
    .map(p => {
      let spaces = p.toLowerCase().split(/\S+/g)[0];
      if (
        spaces[0] === ' ' &&
        (!shortestSpaces || spaces.length < shortestSpaces.length)
      ) {
        shortestSpaces = spaces;
      }
      return p;
    })
    .map(p => p.replace(shortestSpaces, ''))
    .join('\n');
}
