# Focus Board starter

The markup is complete and `../styles.css` is reused from the finished demo.
`js/main.js` contains the DOM references and a numbered list of steps to build
the state, render, persistence, and event logic.

No server is required for this demo, but serving over HTTP is recommended. From
the repository root:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/demos/focus-board/start/>.

The starter uses the same localStorage key as the finished demo
(`focus-board`) when both are served from the same origin, so clear it in
DevTools between runs.
