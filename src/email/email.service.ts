import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

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

  private async getTemplateContent(templateName: string): Promise<string> {
    const templatePath = path.join(__dirname, '..', 'templates', templateName);
    return fs.promises.readFile(templatePath, 'utf8');
  }

  async sendConfirmationEmail(email: string, token: string): Promise<void> {
    const confirmationUrl = `https://ultatel-task-frontend.vercel.app/email-confirmed/${token}`;
    
    let htmlContent = await this.getTemplateContent('email-template.html');
    htmlContent = htmlContent.replace('{{confirmationUrl}}', confirmationUrl);

    await this.transporter.sendMail({
      from: 'ultatel9@gmail.com',
      to: email,
      subject: 'Confirm your email',
      html: htmlContent,
    });
  }
}
