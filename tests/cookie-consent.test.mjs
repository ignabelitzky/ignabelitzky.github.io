import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyticsConfigured,
  analyticsConsentKey,
  normalizeConsent,
  readConsent,
  writeConsent,
} from '../src/lib/analytics-consent.ts';

test('consent normalizes only explicit supported values', () => {
  assert.equal(normalizeConsent('accepted'), 'accepted');
  assert.equal(normalizeConsent('rejected'), 'rejected');
  for (const invalid of [null, undefined, 'yes', 'ACCEPTED', 1])
    assert.equal(normalizeConsent(invalid), null);
});

test('consent persists accepted and rejected preferences and supports changes', () => {
  const values = new Map();
  const store = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  assert.equal(readConsent(store), null);
  assert.equal(writeConsent(store, 'accepted'), true);
  assert.equal(readConsent(store), 'accepted');
  assert.equal(writeConsent(store, 'rejected'), true);
  assert.equal(readConsent(store), 'rejected');
  assert.equal(analyticsConsentKey, 'ib-analytics-consent-v1');
});

test('storage failures safely default to no consent', () => {
  const denied = {
    getItem() {
      throw Error('denied');
    },
    setItem() {
      throw Error('denied');
    },
  };
  assert.equal(readConsent(denied), null);
  assert.equal(writeConsent(denied, 'accepted'), false);
});

test('Analytics is offered only when a valid Measurement ID is configured', () => {
  assert.equal(analyticsConfigured('G-ABCD123'), true);
  assert.equal(analyticsConfigured(''), false);
  assert.equal(analyticsConfigured('UA-123'), false);
});
