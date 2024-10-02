
export function sendSlackNotification(message: string) {
    const url = process.env.SLACK_WEBHOOK_URL
    if (!url) {
        return
    }
    fetch(url, {
        method: "POST",
        body: JSON.stringify({ text: message }),
    })
}