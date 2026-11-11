# BrowserPod edge network: broken compressed responses

With an API key (edge network), a request that accepts gzip gets `Content-Encoding: gzip` back, but the body is already decompressed. Clients that decode it fail: `curl --compressed` gives "incorrect header check", and Node `fetch` gives `Z_DATA_ERROR` or no result. Without an API key, all of this works.

Of BrowserPod's default domains, `github.com`, `raw.githubusercontent.com` and `www.googleapis.com` are affected (tested 2026-11-11). The others don't compress their responses, so they work. Plain `curl` and `git` still reach GitHub.

Run it: `npm install`, put `VITE_BP_APIKEY=<your key>` in `.env`, then `npm run dev` and open the page.

Output with a key:

```
plain: 200
curl: (61) Error while processing content unencoding: incorrect header check
compressed: 200
content-encoding: gzip | first bytes: "# Logs\nl"
```

The last line shows the problem: the header says gzip, but the body is plain text.

It's a 3.5 regression. With `@leaningtech/browserpod` 3.4.0, the same key and the same servers, `--compressed` works and the body really is gzip (it starts with `1f 8b`). The older proxy path re-compresses responses (`cdcd879`, "CF does automatically uncompress and it cannot be avoided"). The `/fetch` path that 3.5 clients use (`5dac4e5`) passes on `Content-Encoding` without re-compressing.

Tested on 2026-11-11 with `@leaningtech/browserpod` 3.5.1 and 3.4.0 and Chrome 155.
