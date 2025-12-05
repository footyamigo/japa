import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// Initialize SES client
let sesClient: SESClient | null = null;

function getSESClient(): SESClient {
  if (!sesClient) {
    const region = process.env.AWS_REGION || 'us-east-1';
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('AWS credentials not configured. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.');
    }

    sesClient = new SESClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }
  return sesClient;
}

interface OrderInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  transactionId: string;
  txRef: string;
  amount: number;
  currency: string;
  password?: string; // Optional password for course access
}

export async function sendOrderConfirmationEmail(orderInfo: OrderInfo) {
  try {
    const { email, firstName, lastName, transactionId, txRef, amount, currency, password } = orderInfo;
    
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation - Japa Course</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(to right, #4f46e5, #7c3aed, #ec4899); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmation</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hello ${firstName} ${lastName},</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Thank you for your purchase! Your payment has been successfully processed.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4f46e5;">
              <h2 style="color: #4f46e5; margin-top: 0; font-size: 20px;">Order Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Product:</td>
                  <td style="padding: 8px 0;">UK & Canada Visa Guides + 24/7 Support Group</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Amount:</td>
                  <td style="padding: 8px 0;">${currency} ${amount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Transaction ID:</td>
                  <td style="padding: 8px 0; font-family: monospace; font-size: 12px;">${transactionId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Reference:</td>
                  <td style="padding: 8px 0; font-family: monospace; font-size: 12px;">${txRef}</td>
                </tr>
              </table>
            </div>
            ${password ? `
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <h3 style="color: #f59e0b; margin-top: 0;">Your Course Access Credentials</h3>
              <p style="margin: 10px 0; font-size: 14px;">
                Your account has been created! Use these credentials to access your course:
              </p>
              <div style="background: white; padding: 15px; border-radius: 6px; margin: 10px 0;">
                <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 8px 0;"><strong>Password:</strong> <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${password}</code></p>
              </div>
              <p style="margin: 10px 0; font-size: 12px; color: #6b7280;">
                Please save these credentials securely. You'll need them to access your course in the future.
              </p>
            </div>
            ` : ''}
            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #10b981; margin-top: 0;">What's Next?</h3>
              <p style="margin: 10px 0;">
                ✓ You now have lifetime access to the UK & Canada Visa Guides<br>
                ✓ Access to 20 comprehensive visa route modules (10 UK + 10 Canada)<br>
                ✓ 24/7 support group access<br>
                ✓ Step-by-step guides, document checklists, and video tutorials
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'}/guides/login" 
                 style="background: #4f46e5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Login to Access Your Guides
              </a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
              If you have any questions or need assistance, please don't hesitate to contact us at support@aphg.org
            </p>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
              Best regards,<br>
              <strong>The Japa Course Team</strong>
            </p>
          </div>
        </body>
      </html>
    `;

    const textBody = `
Order Confirmation - Japa Course

Hello ${firstName} ${lastName},

Thank you for your purchase! Your payment has been successfully processed.

Order Details:
- Product: UK & Canada Visa Guides + 24/7 Support Group
- Amount: ${currency} ${amount.toLocaleString()}
- Transaction ID: ${transactionId}
- Reference: ${txRef}

${password ? `
Your Course Access Credentials:
- Email: ${email}
- Password: ${password}

Please save these credentials securely. You'll need them to access your course in the future.
` : ''}

What's Next?
✓ You now have lifetime access to the UK & Canada Visa Guides
✓ Access to 20 comprehensive visa route modules (10 UK + 10 Canada)
✓ 24/7 support group access
✓ Step-by-step guides, document checklists, and video tutorials

Login to access your guides at: ${process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'}/guides/login

If you have any questions or need assistance, please contact us at support@aphg.org

Best regards,
The Japa Course Team
    `;

    const client = getSESClient();
    const command = new SendEmailCommand({
      Source: 'support@aphg.org',
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: 'Order Confirmation - Japa Course',
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: 'UTF-8',
          },
          Text: {
            Data: textBody,
            Charset: 'UTF-8',
          },
        },
      },
    });

    const response = await client.send(command);
    return { success: true, messageId: response.MessageId };
  } catch (error: any) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

