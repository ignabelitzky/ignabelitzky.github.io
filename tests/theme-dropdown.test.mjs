import test from 'node:test';
import assert from 'node:assert/strict';
import { themeKeyResult } from '../src/lib/theme-dropdown.ts';
import { dacor, experiencePeriod } from '../src/data/experience.ts';

const closed = { open: false, active: 0, selected: 'system' };
test('Dropdown arrow navigation previews options without changing the selected theme', () => {
  let result = themeKeyResult(closed, 'ArrowDown');
  assert.equal(result.state.open, true);
  assert.equal(result.state.active, 0);
  result = themeKeyResult(result.state, 'ArrowUp');
  assert.equal(result.state.active, 2);
  assert.equal(result.state.selected, 'system');
  assert.equal(result.commit, undefined);
  assert.equal(result.handled, true);
  result = themeKeyResult(result.state, 'ArrowDown');
  assert.equal(result.state.active, 0);
});
test('Dropdown Enter and Space commit only the highlighted option and close the popup', () => {
  for (const key of ['Enter', ' ']) {
    const opened = themeKeyResult(closed, key);
    const end = themeKeyResult(opened.state, 'End');
    const commit = themeKeyResult(end.state, key);
    assert.equal(commit.commit, 'dark');
    assert.equal(commit.state.selected, 'dark');
    assert.equal(commit.state.open, false);
  }
});
test('Dropdown Escape and Tab cancel preview; Tab retains normal browser focus movement', () => {
  const preview = { open: true, active: 2, selected: 'light' };
  for (const key of ['Escape', 'Tab']) {
    const result = themeKeyResult(preview, key);
    assert.deepEqual(result.state, { open: false, active: 1, selected: 'light' });
    assert.equal(result.commit, undefined);
    assert.equal(result.handled, key === 'Escape');
  }
});
test('Dropdown Home/End and unrelated keys keep a valid three-option state', () => {
  assert.equal(themeKeyResult(closed, 'End').state.active, 2);
  assert.equal(themeKeyResult(closed, 'Home').state.active, 0);
  assert.deepEqual(themeKeyResult(closed, 'Shift'), { state: closed, handled: false });
});
test('DACOR keeps a single ongoing period and a stable bilingual case study', () => {
  assert.equal(experiencePeriod('en'), '2023–present');
  assert.equal(experiencePeriod('es'), '2023–actualidad');
  assert.equal(dacor.endYear, null);
  assert.equal(dacor.website, 'https://www.veterinariadacor.com/');
  assert.equal(dacor.caseStudySlug, 'veterinaria-dacor');
  assert.equal(dacor.translations.en.responsibilities.length, 3);
  assert.equal(dacor.translations.es.responsibilities.length, 3);
});
