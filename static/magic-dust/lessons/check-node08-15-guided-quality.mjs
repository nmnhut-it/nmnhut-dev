import { execFileSync } from 'node:child_process';
import { GUIDED_NODE_CONTRACTS } from './node08-15-quality-contract.mjs';

const args = process.argv.slice(2);
const baseline = args.includes('--baseline');
const visual = args.includes('--visual');
const requestedNode = args.includes('--node') ? args[args.indexOf('--node') + 1] : null;
const selected = Object.entries(GUIDED_NODE_CONTRACTS).filter(([name]) => !requestedNode || name === requestedNode);
if (!selected.length) throw new Error(`unknown node contract: ${requestedNode}`);

const runNode = scriptArgs => execFileSync(process.execPath, scriptArgs, { cwd: process.cwd(), stdio: 'inherit' });
runNode(['lessons/test-node08-15-quality-gate.mjs', ...(baseline ? ['--baseline'] : []), ...(requestedNode ? ['--node', requestedNode] : [])]);
for (const [, contract] of selected) {
  runNode(['lessons/check-voice-terms.mjs', '--strict', contract.file]);
  runNode(['lessons/validate-content.mjs', '--strict', contract.file]);
}
runNode(['lessons/test-code-trace-cell.mjs']);
if (visual && requestedNode === 'node11') runNode(['lessons/test-node11-walkthrough-browser.mjs']);
else if (visual) runNode(['lessons/test-guided-execution-visual.mjs', ...(requestedNode ? ['--node', requestedNode] : [])]);
console.log(`node08-15 quality suite: pass (${baseline ? 'baseline preservation' : 'guided redesign'}${visual ? ', visual' : ''})`);
