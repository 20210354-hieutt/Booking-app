import sgMail from '@sendgrid/mail';
export declare class GmailService {
    constructor();
    sendEmail(to: string, subject: string, text: string, html: string): Promise<[sgMail.ClientResponse, {}]>;
}
