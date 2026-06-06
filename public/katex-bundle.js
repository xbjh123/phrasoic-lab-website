(function() {
  var script1 = document.createElement('script');
  script1.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.18/dist/katex.min.js';
  script1.onload = function() {
    var script2 = document.createElement('script');
    script2.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.18/dist/contrib/auto-render.min.js';
    script2.onload = function() {
      renderMathInElement(document.body, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false}
        ],
        throwOnError: false
      });
    };
    document.head.appendChild(script2);
  };
  document.head.appendChild(script1);
})();
