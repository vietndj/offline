/**
 * Empirical Boundary Stress Test Suite for Milestone M1
 * Challenger M1-R2-2: Tests React SSR rendering with boundary inputs
 */

import esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const testRunnerSrc = `
import React from 'react';
import { renderToString } from 'react-dom/server';
import { DefinitionSection } from '../src/sections/DefinitionSection';
import { PainSection } from '../src/sections/PainSection';
import { GrowthChartSection } from '../src/sections/GrowthChartSection';
import { HeroSection } from '../src/sections/HeroSection';
import { CurriculumSection } from '../src/sections/CurriculumSection';
import { FaqSection } from '../src/sections/FaqSection';
import { MetaphorsSection } from '../src/sections/MetaphorsSection';
import { ShowcaseSection } from '../src/sections/ShowcaseSection';
import { CONTENT } from '../src/content';

let challengeCount = 0;

console.log('\\n=== EMPIRICAL BOUNDARY STRESS TESTS ===\\n');

// 1. DefinitionSection highlightWord=""
console.log('1. Testing DefinitionSection with empty highlightWord:');
try {
  const origHighlight = CONTENT.definition.highlightWord;
  CONTENT.definition.highlightWord = '';
  const html = renderToString(React.createElement(DefinitionSection));
  const subheadline = CONTENT.definition.subheadline;
  if (!html.includes(subheadline)) {
    console.error('   ❌ FAIL: Subheadline truncated!');
    challengeCount++;
  } else {
    console.log('   ✔ PASS: Renders full subheadline without truncation or crash.');
  }
  CONTENT.definition.highlightWord = origHighlight;
} catch (e) {
  console.error('   ❌ FAIL: Crash with empty highlightWord:', e.message);
  challengeCount++;
}

// 2. PainSection empty tabs: []
console.log('\\n2. Testing PainSection with empty tabs array:');
try {
  const origTabs = CONTENT.painPoints.tabs;
  CONTENT.painPoints.tabs = [];
  const html = renderToString(React.createElement(PainSection));
  console.log('   ✔ PASS: Rendered without crash when tabs = [] (HTML size: ' + html.length + ' bytes)');
  CONTENT.painPoints.tabs = origTabs;
} catch (e) {
  console.error('   ❌ FAIL: Crash with empty tabs []:', e.message);
  challengeCount++;
}

// 3. PainSection single tab
console.log('\\n3. Testing PainSection with single tab:');
try {
  const origTabs = CONTENT.painPoints.tabs;
  CONTENT.painPoints.tabs = [origTabs[0]];
  const html = renderToString(React.createElement(PainSection));
  console.log('   ✔ PASS: Rendered without crash with single tab (HTML size: ' + html.length + ' bytes)');
  CONTENT.painPoints.tabs = origTabs;
} catch (e) {
  console.error('   ❌ FAIL: Crash with single tab:', e.message);
  challengeCount++;
}

// 4. GrowthChartSection single point data
console.log('\\n4. Testing GrowthChartSection with single-point data [1 item]:');
try {
  const origData = CONTENT.chart.data;
  CONTENT.chart.data = [{ month: 'Tháng 1', marketing: 45, normal: 30 }];
  const html = renderToString(React.createElement(GrowthChartSection));
  console.log('   ✔ PASS: GrowthChartSection rendered with single point');
  CONTENT.chart.data = origData;
} catch (e) {
  console.error('   ❌ CHALLENGE CONFIRMED: GrowthChartSection threw TypeError with single point: ' + e.message);
  challengeCount++;
}

// 5. GrowthChartSection empty data []
console.log('\\n5. Testing GrowthChartSection with empty data [0 items]:');
try {
  const origData = CONTENT.chart.data;
  CONTENT.chart.data = [];
  const html = renderToString(React.createElement(GrowthChartSection));
  console.log('   ✔ PASS: GrowthChartSection rendered with empty data []');
  CONTENT.chart.data = origData;
} catch (e) {
  console.error('   ❌ CHALLENGE CONFIRMED: GrowthChartSection threw TypeError with empty data: ' + e.message);
  challengeCount++;
}

// 6. GrowthChartSection two-point data
console.log('\\n6. Testing GrowthChartSection with two points [2 items]:');
try {
  const origData = CONTENT.chart.data;
  CONTENT.chart.data = [
    { month: 'Tháng 1', marketing: 45, normal: 30 },
    { month: 'Tháng 2', marketing: 60, normal: 35 }
  ];
  const html = renderToString(React.createElement(GrowthChartSection));
  console.log('   ✔ PASS: GrowthChartSection rendered with two points');
  CONTENT.chart.data = origData;
} catch (e) {
  console.error('   ❌ CHALLENGE CONFIRMED: GrowthChartSection threw TypeError with two points: ' + e.message);
  challengeCount++;
}

// 7. General Section Resiliency on empty collections
console.log('\\n7. Testing other core sections with empty collections:');
try {
  const origTags = CONTENT.hero.tags;
  CONTENT.hero.tags = [];
  renderToString(React.createElement(HeroSection));
  CONTENT.hero.tags = origTags;
  console.log('   ✔ HeroSection: handles empty tags []');
} catch (e) {
  console.error('   ❌ HeroSection crash:', e.message);
  challengeCount++;
}

try {
  const origDays = CONTENT.curriculum.days;
  CONTENT.curriculum.days = [];
  renderToString(React.createElement(CurriculumSection));
  CONTENT.curriculum.days = origDays;
  console.log('   ✔ CurriculumSection: handles empty days []');
} catch (e) {
  console.error('   ❌ CurriculumSection crash:', e.message);
  challengeCount++;
}

try {
  const origFaq = CONTENT.faqSection.items;
  CONTENT.faqSection.items = [];
  renderToString(React.createElement(FaqSection));
  CONTENT.faqSection.items = origFaq;
  console.log('   ✔ FaqSection: handles empty items []');
} catch (e) {
  console.error('   ❌ FaqSection crash:', e.message);
  challengeCount++;
}

console.log('\\n=======================================');
console.log('Summary: ' + (challengeCount === 0 ? 'ALL BOUNDARY TESTS PASSED' : challengeCount + ' VULNERABILITY(IES) CONFIRMED'));
console.log('=======================================\\n');

if (challengeCount > 0) {
  process.exit(1);
}
`;

fs.writeFileSync('tests/_runner_tmp.tsx', testRunnerSrc);

try {
  esbuild.buildSync({
    entryPoints: ['tests/_runner_tmp.tsx'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile: 'tests/_runner_tmp.mjs',
    packages: 'external',
    loader: { '.tsx': 'tsx', '.ts': 'ts' }
  });

  execSync('node tests/_runner_tmp.mjs', { stdio: 'inherit' });
} catch (e) {
  process.exit(1);
} finally {
  if (fs.existsSync('tests/_runner_tmp.tsx')) fs.unlinkSync('tests/_runner_tmp.tsx');
  if (fs.existsSync('tests/_runner_tmp.mjs')) fs.unlinkSync('tests/_runner_tmp.mjs');
}
