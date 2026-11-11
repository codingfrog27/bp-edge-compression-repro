# BrowserPod edge network: broken compressed responses

With an API key (edge network), a request that accepts gzip gets `Content-Encoding: gzip` back, but the body is already decompressed. Clients that decode it fail: `curl --compressed` gives "incorrect header check", and Node `fetch` gives `Z_DATA_ERROR` or no result. Without an API key, all of this works.

Run it: `npm install`, put `VITE_BP_APIKEY=<your key>` in `.env`, then `npm run dev` and open the page.

Output with a key:

```
plain: 200
curl: (61) Error while processing content unencoding: incorrect header check
compressed: 200
content-encoding: gzip | first bytes: "# Logs\nl"
```

The last line shows the problem: the header says gzip, but the body is plain text.

Tested on 2026-11-11 with `@leaningtech/browserpod` 3.5.1 and Chrome 155.
