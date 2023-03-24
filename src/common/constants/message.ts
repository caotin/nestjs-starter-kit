export const SUBJECT_EMAIL = {
  WELCOME: 'Thanks for joining!',
  ORDER_CONFIRMATION: 'Thanks for your order!',
  RESET_PASSWORD: 'Reset your password',
  VERIFY: 'Your account needs verification',
};

export interface ITemplateWelcomeInput {
  companyName: string;
  recipient: string;
}

export interface ITemplateWelcomeInput {
  companyName: string;
  recipient: string;
}

export interface ITemplateVerifyInput {
  companyName: string;
  recipient: string;
  link;
}

export type ITemplateInput = ITemplateWelcomeInput | ITemplateVerifyInput;

export const TEMPLATES = {
  WELCOME: {
    subject: 'Thanks for joining!',
    template: `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to [companyName]</title>
      </head>
      <body>
        <h1>Welcome to [companyName]!</h1>
        <p>Dear [recipient],</p>
        <p>We are thrilled to have you as a member of [companyName]! As a member, you will gain access to our exclusive content, special offers, and community events.</p>
        <p>At [companyName], we strive to provide the best possible experience for our members. If you have any questions or feedback, please do not hesitate to contact our support team.</p>
        <p>Thank you for joining us and we look forward to seeing you around!</p>
        <p>Best regards,</p>
        <p>The [companyName] Team</p>
      </body>
    </html>`,
  },
  VERIFY: {
    subject: 'Your account needs verification',
    template: `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Verify your email address</title>
      </head>
      <body>
        <h1>Verify your email address</h1>
        <p>Dear [recipient],</p>
        <p>Thank you for signing up with [companyName]! Please verify your email address by clicking on the link below:</p>
        <p><a href="[link]">Verify my email address</a></p>
        <p>If you did not sign up for our service, please disregard this email.</p>
        <p>Thank you!</p>
        <p>Best regards,</p>
        <p>The [companyName] Team</p>
      </body>
    </html>`,
  },
};

export type TemplateType = keyof typeof TEMPLATES;
