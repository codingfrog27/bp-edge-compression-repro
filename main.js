import { BrowserPod } from '@leaningtech/browserpod';

const URL = 'https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore';

const pod = await BrowserPod.boot({ apiKey: import.meta.env.VITE_BP_APIKEY });
const terminal = await pod.createDefaultTerminal(document.querySelector('#console'));

await pod.run('bash', ['-c', `
curl -sS -o /dev/null -w "plain: %{http_code}\\n" ${URL}
curl -sS --compressed -o /dev/null -w "compressed: %{http_code}\\n" ${URL}
node -e "require('https').get('${URL}', { headers: { 'accept-encoding': 'gzip' } }, r => r.once('data', d => console.log('content-encoding:', r.headers['content-encoding'], '| first bytes:', JSON.stringify(d.subarray(0, 8).toString()))))"
echo done
`], { terminal });
