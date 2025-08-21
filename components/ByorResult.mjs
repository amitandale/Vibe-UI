// components/ByorResult.mjs
import React from 'react';

export function ByorResult({ prUrl, requiredChecks = [] }) {
  return React.createElement('div', null,
    React.createElement('p', null, prUrl ? 'PR created:' : 'No PR'),
    prUrl ? React.createElement('a', { href: prUrl, target:'_blank', rel:'noreferrer' }, prUrl) : null,
    React.createElement('h4', null, 'Required Checks'),
    React.createElement('ul', null, ...requiredChecks.map(c => React.createElement('li', { key:c }, c)))
  );
}
