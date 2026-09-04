#!/usr/bin/env node
import { colors } from './helpers.mjs';
import { runTier1Tests } from './tier1-features.test.mjs';
import { runTier2Tests } from './tier2-boundaries.test.mjs';
import { runTier3Tests } from './tier3-combinations.test.mjs';
import { runTier4Tests } from './tier4-journeys.test.mjs';

async function main() {
  const args = process.argv.slice(2);
  const tierArg = args.find(a => a.startsWith('--tier='));
  const requestedTier = tierArg ? parseInt(tierArg.split('=')[1], 10) : null;

  console.log(`\n${colors.bright}${colors.cyan}========================================================================`);
  console.log(`🚀 OFFLINE.FEDU.VN OPAQUE-BOX E2E TEST RUNNER`);
  console.log(`========================================================================${colors.reset}\n`);
  console.log(`Execution Mode: ${requestedTier ? `Tier ${requestedTier} Only` : 'Full Suite (Tiers 1 - 4)'}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Node.js Version: ${process.version}\n`);

  const startTime = Date.now();
  const tierSummaries = [];

  try {
    if (!requestedTier || requestedTier === 1) {
      const s1 = await runTier1Tests();
      tierSummaries.push(s1);
    }
    if (!requestedTier || requestedTier === 2) {
      const s2 = await runTier2Tests();
      tierSummaries.push(s2);
    }
    if (!requestedTier || requestedTier === 3) {
      const s3 = await runTier3Tests();
      tierSummaries.push(s3);
    }
    if (!requestedTier || requestedTier === 4) {
      const s4 = await runTier4Tests();
      tierSummaries.push(s4);
    }
  } catch (fatalErr) {
    console.error(`\n${colors.red}FATAL ERROR IN TEST RUNNER:${colors.reset}`, fatalErr);
    process.exit(1);
  }

  const totalDuration = Date.now() - startTime;
  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  let totalSkipped = 0;

  console.log(`\n${colors.bright}${colors.cyan}========================================================================`);
  console.log(`📊 E2E TEST EXECUTION SUMMARY MATRIX`);
  console.log(`========================================================================${colors.reset}\n`);

  console.log(`┌────────────────────────────────────────────────────────┬───────┬──────┬──────┬───────┬─────────┐`);
  console.log(`│ Test Suite Tier                                        │ Total │ Pass │ Fail │ Skip  │ Time    │`);
  console.log(`├────────────────────────────────────────────────────────┼───────┼──────┼──────┼───────┼─────────┤`);

  for (const s of tierSummaries) {
    totalTests += s.total;
    totalPassed += s.passed;
    totalFailed += s.failed;
    totalSkipped += s.skipped;

    const nameCol = s.name.padEnd(54, ' ');
    const totCol = String(s.total).padStart(5, ' ');
    const passCol = String(s.passed).padStart(4, ' ');
    const failCol = String(s.failed).padStart(4, ' ');
    const skipCol = String(s.skipped).padStart(5, ' ');
    const timeCol = `${s.duration}ms`.padStart(7, ' ');

    const statusColor = s.failed > 0 ? colors.red : colors.green;
    console.log(`│ ${statusColor}${nameCol}${colors.reset} │ ${totCol} │ ${colors.green}${passCol}${colors.reset} │ ${s.failed > 0 ? colors.red : colors.gray}${failCol}${colors.reset} │ ${skipCol} │ ${timeCol} │`);
  }

  console.log(`├────────────────────────────────────────────────────────┼───────┼──────┼──────┼───────┼─────────┤`);
  const totLabel = 'TOTAL COMBINED E2E EXECUTION'.padEnd(54, ' ');
  const allTot = String(totalTests).padStart(5, ' ');
  const allPass = String(totalPassed).padStart(4, ' ');
  const allFail = String(totalFailed).padStart(4, ' ');
  const allSkip = String(totalSkipped).padStart(5, ' ');
  const allTime = `${totalDuration}ms`.padStart(7, ' ');
  console.log(`│ ${colors.bright}${totLabel}${colors.reset} │ ${allTot} │ ${colors.green}${allPass}${colors.reset} │ ${totalFailed > 0 ? colors.red : colors.green}${allFail}${colors.reset} │ ${allSkip} │ ${allTime} │`);
  console.log(`└────────────────────────────────────────────────────────┴───────┴──────┴──────┴───────┴─────────┘\n`);

  if (totalFailed > 0) {
    console.log(`${colors.red}${colors.bright}❌ RESULT: ${totalFailed} TEST(S) FAILED out of ${totalTests}${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`${colors.green}${colors.bright}🎉 RESULT: ALL ${totalPassed} E2E TESTS PASSED SUCCESSFULLY in ${totalDuration}ms!${colors.reset}\n`);
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Unhandled runner exception:', err);
  process.exit(1);
});
