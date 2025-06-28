async function main(){
    let delay = 100;
    setInterval(async()=>{
        let randomNumber = String(Math.floor(Math.random() * 1000));
        const payload ={
            to: "student@example.com",
            subject: "Welcome to the course!hhh"+randomNumber,
            template: "welcome",
            variables: {
                name: "John Doe",
                course: "Web Development"
            }
        }

        const response = await fetch("http://localhost:3000/api/v1/email/send", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer sk_live_9eiupjiq0qnwnh8x83799`
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        console.log(data)
    }, delay);
}
main().then(()=>{
    console.log("Email sending started...");
}).catch((err)=>{
    console.error("Error in main function:", err);
}); 