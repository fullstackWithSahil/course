"use server"
const webhook = process.env.DISCORD_WEBHOOK;

export default async function sendDiscordMessage(message: string){
    await fetch(webhook!,{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            content:message
        })
    })
}