import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const state = read("lib/site-state.ts");
const build = read("components/BuildProof.tsx");
const research = read("components/ResearchEvidence.tsx");
const evidence = read("app/evidence/page.tsx");
const verification = read("app/verification/page.tsx");

test("pin exact historical reproducible-build source and tree", () => {
  assert.match(state, /6559e4cd5394ad4b32b966681223b98637a59282/);
  assert.match(state, /53d31cb452ce944a3fa884cbcc70567a165cb283/);
  assert.match(build, /HISTORICAL \/ SOURCE-SCOPED/);
});
test("show verified R14 research and preserve earlier R13 provenance", () => {
  assert.match(state, /0633b90c973dc876d0ab116e4376f3ceb7a581fc/);
  assert.match(state, /42382437854/);
  assert.match(state, /62\/62 R14, 57\/57 R13, 61\/61 R12, 41\/41 R11/);
  assert.match(state, /64bff9f955d04e324656cb9c6a15651df26d296f/);
  assert.match(state, /41505374595/);
  assert.match(research, /NOT A RELEASE PASS/);
  assert.match(evidence, /<ResearchEvidence \/>/);
  assert.match(verification, /<ResearchEvidence \/>/);
});
test("do not grant independent trust, finality or migration authority", () => {
  assert.match(state, /9 material RED remain OPEN/);
  assert.match(state, /untrusted checkpoint/);
  for (const p of ["authenticatedBeaconFinality", "realBaseStateProof", "r14IndependentResult"]) {
    assert.match(state, new RegExp(`${p}: "NOT VERIFIED"`));
  }
  assert.match(state, /migrationOrLaunchAuthority: "NONE"/);
  assert.match(state, /fullE5AndProductAcceptance: "PENDING"/);
});
test("disclose general F2B CI failure accurately", () => {
  assert.match(state, /42382437838/);
  assert.match(state, /pinned dependency snapshot restore; later static\/build steps SKIPPED/);
});
test("public canonical status, economics and participation are unchanged", () => {
  assert.match(state, /lifecycle: "PRE_GENESIS"/);
  assert.match(state, /participationOpen: false/);
  assert.match(state, /productionDeployment: "PENDING"/);
  assert.match(state, /price: "USD 0.025 \/ VYREN"/);
  assert.match(state, /vesting: "90-day cliff \+ 12 calendar months linear"/);
});
