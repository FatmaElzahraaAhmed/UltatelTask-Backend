import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'ultatel9@gmail.com',
        pass: 'fmnq icjp jbrv vpee',
      },
    });
  }

  async sendConfirmationEmail(email: string, token: string): Promise<void> {
    const confirmationUrl = `http://localhost:4200/email-confirmed/?token=${token}`;

    await this.transporter.sendMail({
      from: 'ultatel9@gmail.com',
      to: email,
      subject: 'Confirm your email',
      html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 10px;
            }
            .confirmation-link {
              display: inline-block;
              padding: 10px 20px;
              background-color: #007bff;
              color: white !important;
              text-decoration: none;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Please confirm your email</h2>
            <p>Click the following link to confirm your email address:</p>
            <a class="confirmation-link" href="${confirmationUrl}">Confirm Email</a>
          </div>
        </body>
      </html>
    `,
    });
  }
}
