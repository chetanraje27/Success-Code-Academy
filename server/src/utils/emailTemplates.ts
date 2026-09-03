/**
 * Branded HTML email templates for Success Code Academy.
 *
 * Every template renders through one shell: a navy gradient header band, a
 * white content card, an accent rule in the site's teal/gold palette, and a
 * muted footer. Colors mirror the public site (#102f5e navy, #087f83 teal,
 * #d2a22b gold). Email-safe: tables, inline styles, no external images.
 *
 * Each template returns { html, text } so the mailer can send both parts.
 */

const BRAND = {
  navy: '#102f5e',
  navyDeep: '#0a2348',
  teal: '#087f83',
  gold: '#d2a22b',
  text: '#14243a',
  muted: '#5d6c7e',
  border: '#d7e0e9',
  bg: '#f6f8fb',
  softTeal: '#eaf8f7',
};

const WEBSITE = 'https://www.successcodeacademy.in';

function escapeHtml(input: string): string {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function shell(options: {
  heading: string;
  bodyHtml: string;
  footerNote?: string;
}): { html: string; text: string } {
  const { heading, bodyHtml, footerNote } = options;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:Arial,Helvetica,sans-serif;color:${BRAND.text};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid ${BRAND.border};border-radius:12px;overflow:hidden;">

  <tr>
    <td style="background:linear-gradient(110deg,${BRAND.navy} 0%,#184a78 100%);padding:28px 32px;text-align:center;">
      <div style="font-size:19px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">Success Code Academy</div>
      <div style="margin-top:6px;font-size:12px;color:rgba(255,255,255,0.72);letter-spacing:1.5px;text-transform:uppercase;">Empowering Futures Through Quality Education</div>
    </td>
  </tr>

  <tr><td style="height:3px;background:linear-gradient(90deg,${BRAND.navy},${BRAND.teal} 52%,${BRAND.gold});font-size:0;line-height:0;">&nbsp;</td></tr>

  <tr>
    <td style="padding:32px;">
      <h1 style="margin:0 0 18px;font-size:21px;line-height:1.25;color:${BRAND.navy};letter-spacing:-0.4px;">${escapeHtml(heading)}</h1>
      ${bodyHtml}
    </td>
  </tr>

  <tr>
    <td style="padding:20px 32px 28px;border-top:1px solid ${BRAND.border};background:#fafcfe;">
      <p style="margin:0;font-size:12px;line-height:1.6;color:${BRAND.muted};">
        ${footerNote ? escapeHtml(footerNote) + '<br>' : ''}
        Success Code Academy &middot; Baramati, Maharashtra<br>
        <a href="${WEBSITE}" style="color:${BRAND.teal};text-decoration:none;">${WEBSITE}</a> &middot; +91 86004 70850
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  // Text version: strip the table scaffolding; callers provide real text.
  const text = heading;
  return { html, text };
}

function detailTable(rows: Array<[string, string]>): string {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;border:1px solid ${BRAND.border};border-radius:9px;">
${rows
  .map(
    ([label, value]) => `
<tr>
  <td style="padding:10px 14px;border-bottom:1px solid ${BRAND.border};font-size:12px;font-weight:700;color:${BRAND.muted};text-transform:uppercase;letter-spacing:0.6em;width:38%;vertical-align:top;">${escapeHtml(label)}</td>
  <td style="padding:10px 14px;border-bottom:1px solid ${BRAND.border};font-size:14px;color:${BRAND.text};vertical-align:top;">${escapeHtml(value)}</td>
</tr>`,
  )
  .join('')}
</table>`;
}

function primaryButton(url: string, label: string): string {
  return `
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 6px;">
<tr>
<td style="background:${BRAND.navy};border-radius:8px;">
<a href="${url}" style="display:inline-block;padding:12px 26px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">${escapeHtml(label)}</a>
</td>
</tr>
</table>`;
}

function paragraph(text: string): string {
  return `<p style="margin:0 0 14px;font-size:14px;line-height:1.65;color:${BRAND.muted};">${escapeHtml(text)}</p>`;
}

function greeting(name: string): string {
  return `<p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:${BRAND.text};">Hello <strong>${escapeHtml(name)}</strong>,</p>`;
}

export function newsletterWelcome(email: string): { html: string; text: string } {
  const bodyHtml = `
${greeting('there')}
${paragraph("Thank you for subscribing to Success Code Academy updates. You'll now hear about new batches, scholarship tests, NEET results, and academy news before anyone else.")}
${paragraph('No spam, ever — only the announcements that matter to your NEET journey.')}
${primaryButton(WEBSITE, 'Visit the Academy')}
${paragraph('If you did not subscribe, simply ignore this email and you will not be added again.')}`;

  const text = [
    'Hello,',
    '',
    "Thank you for subscribing to Success Code Academy updates. You'll now hear about new batches, scholarship tests, NEET results, and academy news before anyone else.",
    '',
    'No spam, ever — only the announcements that matter to your NEET journey.',
    '',
    `Visit the academy: ${WEBSITE}`,
    '',
    'If you did not subscribe, simply ignore this email and you will not be added again.',
  ].join('\n');

  return { html: shell({ heading: 'Welcome to SCA Updates', bodyHtml }).html, text };
}

export function studentWelcome(params: {
  firstName: string;
  mobileNumber: string;
}): { html: string; text: string } {
  const bodyHtml = `
${greeting(params.firstName)}
${paragraph('Your Success Code Academy student account is ready. You can now sign in anytime with your registered mobile number.')}
${detailTable([
  ['Mobile', params.mobileNumber],
])}
${primaryButton(`${WEBSITE}/results`, 'Explore Our Results')}
${paragraph('Our team is with you at every step — conceptual teaching, personal mentorship, and honest guidance. Welcome aboard!')}`;

  const text = [
    `Hello ${params.firstName},`,
    '',
    'Your Success Code Academy student account is ready. You can now sign in anytime with your registered mobile number.',
    '',
    `Mobile: ${params.mobileNumber}`,
    '',
    `Explore our results: ${WEBSITE}/results`,
    '',
    'Our team is with you at every step — conceptual teaching, personal mentorship, and honest guidance. Welcome aboard!',
  ].join('\n');

  return { html: shell({ heading: 'Your SCA Student Account is Ready', bodyHtml }).html, text };
}

export function contactFormReceipt(params: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): { html: string; text: string } {
  const bodyHtml = `
${greeting(params.name)}
${paragraph('We have received your message and our team will get back to you shortly. Here is a copy of what you sent us:')}
${detailTable([
  ['Name', params.name],
  ['Email', params.email],
  ['Phone', params.phone],
  ['Message', params.message],
])}
${paragraph('Our admissions team typically responds within one working day. For anything urgent, call us on +91 86004 70850.')}`;

  const text = [
    `Hello ${params.name},`,
    '',
    'We have received your message and our team will get back to you shortly. Here is a copy of what you sent us:',
    '',
    `Name: ${params.name}`,
    `Email: ${params.email}`,
    `Phone: ${params.phone}`,
    `Message: ${params.message}`,
    '',
    'Our admissions team typically responds within one working day. For anything urgent, call us on +91 86004 70850.',
  ].join('\n');

  return { html: shell({ heading: 'We Received Your Message', bodyHtml }).html, text };
}

export function contactFormStaffAlert(params: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): { html: string; text: string } {
  const bodyHtml = `
${greeting('Team')}
${paragraph('A new enquiry was submitted through the Contact page. Details below. Reply directly to this email to reach the sender.')}
${detailTable([
  ['Name', params.name],
  ['Email', params.email],
  ['Phone', params.phone],
  ['Message', params.message],
])}
${primaryButton(`${WEBSITE}/admin/database/contact-messages`, 'Open in Dashboard')}`;

  const text = [
    'Hello Team,',
    '',
    'A new enquiry was submitted through the Contact page. Details below. Reply directly to this email to reach the sender.',
    '',
    `Name: ${params.name}`,
    `Email: ${params.email}`,
    `Phone: ${params.phone}`,
    `Message: ${params.message}`,
    '',
    `Open in dashboard: ${WEBSITE}/admin/database/contact-messages`,
  ].join('\n');

  return {
    html: shell({
      heading: 'New Contact Enquiry',
      bodyHtml,
      footerNote: 'You receive this because you are a Success Code Academy administrator.',
    }).html,
    text,
  };
}

export function courseRegistrationReceipt(params: {
  studentName: string;
  courseTitle: string;
  visitingDate: string;
  visitingTime: string;
}): { html: string; text: string } {
  const bodyHtml = `
${greeting(params.studentName)}
${paragraph(`Your seat reservation for a campus visit is confirmed. Here are your appointment details:`)}
${detailTable([
  ['Course', params.courseTitle],
  ['Visit Date', params.visitingDate],
  ['Visit Time', params.visitingTime],
])}
${paragraph('Please arrive 10 minutes early and carry a government photo ID. Our counselors will walk you through the classrooms, library, and doubt-solving desks.')}
${primaryButton(WEBSITE, 'Plan Your Visit')}`;

  const text = [
    `Hello ${params.studentName},`,
    '',
    'Your seat reservation for a campus visit is confirmed. Here are your appointment details:',
    '',
    `Course: ${params.courseTitle}`,
    `Visit Date: ${params.visitingDate}`,
    `Visit Time: ${params.visitingTime}`,
    '',
    'Please arrive 10 minutes early and carry a government photo ID. Our counselors will walk you through the classrooms, library, and doubt-solving desks.',
    '',
    `Plan your visit: ${WEBSITE}`,
  ].join('\n');

  return { html: shell({ heading: 'Your Campus Visit is Confirmed', bodyHtml }).html, text };
}

export function scholarshipRegistrationReceipt(params: {
  studentName: string;
  studentClass: string;
  schoolName: string;
  city: string;
  preferredCourse: string;
}): { html: string; text: string } {
  const bodyHtml = `
${greeting(params.studentName)}
${paragraph('Your SCST (Scholarship Test) registration has been recorded. Our team will share your exam slot and center details on your registered mobile number.')}
${detailTable([
  ['Student', params.studentName],
  ['Class', params.studentClass],
  ['School', params.schoolName],
  ['City', params.city],
  ['Preferred Course', params.preferredCourse],
])}
${paragraph('The scholarship test can earn you up to a 100% fee waiver. Keep preparing — every mark counts!')}
${primaryButton(`${WEBSITE}/admissions`, 'About the Scholarship Test')}`;

  const text = [
    `Hello ${params.studentName},`,
    '',
    'Your SCST (Scholarship Test) registration has been recorded. Our team will share your exam slot and center details on your registered mobile number.',
    '',
    `Student: ${params.studentName}`,
    `Class: ${params.studentClass}`,
    `School: ${params.schoolName}`,
    `City: ${params.city}`,
    `Preferred Course: ${params.preferredCourse}`,
    '',
    'The scholarship test can earn you up to a 100% fee waiver. Keep preparing — every mark counts!',
    '',
    `About the scholarship test: ${WEBSITE}/admissions`,
  ].join('\n');

  return { html: shell({ heading: 'Scholarship Test Registration Received', bodyHtml }).html, text };
}

export function adminLoginAlert(params: {
  name: string;
  email: string;
  ip?: string | undefined;
  when: Date;
}): { html: string; text: string } {
  const when = params.when.toUTCString();
  const bodyHtml = `
${greeting(params.name)}
${paragraph('Your administrator account was just signed into successfully. If this was you, no action is needed.')}
${detailTable([
  ['Email', params.email],
  ['Signed In At', when],
  ['IP Address', params.ip || 'Unknown'],
])}
${paragraph('If you do not recognize this sign-in, change your password immediately from the admin dashboard and notify the super administrator.')}`;

  const text = [
    `Hello ${params.name},`,
    '',
    'Your administrator account was just signed into successfully. If this was you, no action is needed.',
    '',
    `Email: ${params.email}`,
    `Signed In At: ${when}`,
    `IP Address: ${params.ip || 'Unknown'}`,
    '',
    'If you do not recognize this sign-in, change your password immediately from the admin dashboard and notify the super administrator.',
  ].join('\n');

  return {
    html: shell({
      heading: 'New Admin Sign-In',
      bodyHtml,
      footerNote: 'You receive this because you are a Success Code Academy administrator.',
    }).html,
    text,
  };
}

export function adminPasswordResetEmail(params: {
  name: string;
  resetUrl: string;
  ttlMinutes: number;
}): { html: string; text: string } {
  const bodyHtml = `
${greeting(params.name)}
${paragraph('Use the button below to choose a new admin password.')}
${primaryButton(params.resetUrl, 'Reset Password')}
${paragraph(`This link expires in ${params.ttlMinutes} minutes and can only be used once.`)}
${paragraph('If the button does not work, copy and paste this link into your browser:')}
<p style="margin:0 0 14px;font-size:12px;line-height:1.6;color:${BRAND.teal};word-break:break-all;">${escapeHtml(params.resetUrl)}</p>
${paragraph('If you did not expect this email, you can ignore it — your current password keeps working.')}`;

  const text = [
    `Hello ${params.name},`,
    '',
    'Use the link below to choose a new admin password.',
    `It expires in ${params.ttlMinutes} minutes and can only be used once.`,
    '',
    params.resetUrl,
    '',
    'If you did not expect this email, you can ignore it — your current password keeps working.',
  ].join('\n');

  return {
    html: shell({ heading: 'Reset Your Admin Password', bodyHtml }).html,
    text,
  };
}
