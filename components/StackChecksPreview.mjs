import React from 'react';
export function StackChecksPreview({ checks = [] }) {
  return React.createElement('div', null,
    React.createElement('h3', null, 'Required Checks'),
    React.createElement('ul', null, ...(checks||[]).map(id => React.createElement('li', { key:id }, id)))
  );
}
