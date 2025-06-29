export default async function sendEmail(data:{
    to: string[];
    from: string;
    subject: string;
    body: string;
}) {
    console.log({data})
}