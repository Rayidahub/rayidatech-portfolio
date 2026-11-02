import { describe, it, expect } from 'vitest';
import {
  personalizeTeamMessage,
  buildTeamHtmlEmail,
} from '@/lib/email/team-email-utils';

describe('Team Email Personalization & Formatting', () => {
  it('correctly substitutes dynamic variables for a team member', () => {
    const template = 'Hello {{name}}, as our {{role}}, please check {{email}}. Sent by {{sender_name}} from {{company_name}}.';
    const member = {
      name: 'Adeola Martins',
      role: 'Lead Developer',
      email: 'adeola@rayidatech.name.ng',
    };

    const rendered = personalizeTeamMessage(template, member, {
      senderName: 'Raymond Gaius',
      companyName: 'Rayida Tech',
    });

    expect(rendered).toContain('Hello Adeola Martins,');
    expect(rendered).toContain('as our Lead Developer,');
    expect(rendered).toContain('please check adeola@rayidatech.name.ng.');
    expect(rendered).toContain('Sent by Raymond Gaius from Rayida Tech.');
    expect(rendered).not.toContain('{{');
    expect(rendered).not.toContain('}}');
  });

  it('safely cleans unresolved tags in team messages', () => {
    const template = 'Hi {{name}}, regarding {{unknown_task_token}} and {{custom_field}}.';
    const member = {
      name: 'Fatima Bello',
      role: 'UI/UX Designer',
      email: 'fatima@rayidatech.name.ng',
    };

    const rendered = personalizeTeamMessage(template, member);
    expect(rendered).toContain('Hi Fatima Bello, regarding  and .');
    expect(rendered).not.toMatch(/\{\{[^}]+\}\}/);
  });

  it('builds a branded internal HTML email layout', () => {
    const html = buildTeamHtmlEmail({
      body: 'First paragraph with updates.\n\nSecond paragraph with deliverables.',
      recipientName: 'Chidi Nwosu',
      recipientRole: 'Brand Strategist',
      senderName: 'Raymond Gaius',
      companyName: 'Rayida Tech',
    });

    expect(html).toContain('Rayida Tech');
    expect(html).toContain('Internal Team Communication');
    expect(html).toContain('Chidi Nwosu');
    expect(html).toContain('Brand Strategist');
    expect(html).toContain('First paragraph with updates.');
    expect(html).toContain('Second paragraph with deliverables.');
    expect(html).toContain('Raymond Gaius');
    expect(html).toContain('rayidatech.name.ng');
  });
});

