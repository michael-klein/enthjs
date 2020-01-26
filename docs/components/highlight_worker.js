onmessage = event => {
  importScripts('../highlight/highlight.pack.js');
  importScripts('./prettier.js');
  importScripts('./parser-babylon.js');
  const text = event.data;
  const code = prettier.format(text, {
    parser: 'babel',
    plugins: prettierPlugins,
  });
  let parts = code.split(/\n/g);
  parts = filterInitialEmptyLines(parts);
  parts = filterInitialEmptyLines(parts.reverse()).reverse();
  const result = self.hljs.highlightAuto(parts.join('\n'));
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
