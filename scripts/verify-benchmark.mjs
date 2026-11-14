import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const current=JSON.parse(readFileSync('public/benchmark.json','utf8'));
const saved=JSON.parse(execFileSync('git',['show','HEAD:public/benchmark.json'],{encoding:'utf8'}));
// Generation timestamps are intentionally variable. Compare every case and result.
const {generatedAt:currentTime,...actual}=current;
const {generatedAt:savedTime,...expected}=saved;
assert.deepEqual(actual,expected,'Benchmark cases changed. Review and commit the updated evaluation with the policy change.');
console.log('Every benchmark case and summary agrees with the committed evaluation.');
