import { Resend } from 'resend';

export default async function sendEmail({
    to,
    from,
    subject,
    html,
}:{
    to: string[];
    from: string;
    subject: string;
    html :string;
}) {
    if(process.env.ENV=="development"){
        console.log("Email sending is disabled in development mode.");
        console.log(`To: ${to.join(', ')}`);
        console.log(`From: ${from}`);
        console.log(`Subject: ${subject}`);
        console.log(`HTML: ${html}`);
    }else{

        const resend = new Resend(process.env.RESEND_API);
        to.forEach(email => {
            if (!email.includes('@')) {
                throw new Error(`Invalid email address: ${email}`);
            }
            resend.emails.send({
                from,
                subject,
                to: email,
                html 
            });
        })
    }
}