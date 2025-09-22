import './globals.css';
import React from 'react';
import PlanBanner from './components/PlanBanner.jsx';

export const metadata = { title: 'Vibe UI', description: 'Vibe UI' };

export default function RootLayout({ children }) {
  return React.createElement(
    'html', { lang: 'en' },
    React.createElement(
      'body', null,
      React.createElement(PlanBanner, null),
      React.createElement(
        'div', { className: 'shell' },
        React.createElement(
          'aside', { className: 'side' },
          React.createElement('div', { className: 'logo' }, 'Vibe UI'),
          React.createElement(
            'nav', { style: { marginTop: 12 } },
            React.createElement('a', { href: '/' }, 'Home'),
            React.createElement('a', { href: '/studio' }, 'Studio'),
            React.createElement('a', { href: '/prs' }, 'PRs'),
            React.createElement('a', { href: '/projects' }, 'Projects'),
            React.createElement('a', { href: '/projects/refs' }, 'Refs'),
            React.createElement('a', { href: '/admin/meter' }, 'Meter'),
            React.createElement('a', { href: '/billing' }, 'Billing'),
            React.createElement('a', { href: '/integrations/slack' }, 'Slack')
          )
        ),
        React.createElement(
          'main', { className: 'main' },
          React.createElement(
            'header', { className: 'top' },
            React.createElement('div', { className: 'muted' }, 'Vibe UI'),
            React.createElement('div', { className: 'muted' }, 'v0')
          ),
          React.createElement('div', { className: 'content' }, children)
        )
      )
    )
  );
}
