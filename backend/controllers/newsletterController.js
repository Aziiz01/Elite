import NewsletterModel from "../models/newsletterModel.js";
import { sendNewsletterWelcomeEmail, sendNewsletterCustomEmail } from "../services/mailService.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        const trimmed = (email || "").trim().toLowerCase();

        if (!trimmed) {
            return res.status(400).json({ error: "Email is required" });
        }
        if (!emailRegex.test(trimmed)) {
            return res.status(400).json({ error: "Invalid email address" });
        }

        const existing = await NewsletterModel.findOne({ email: trimmed });
        if (existing) {
            return res.status(200).json({ message: "Already subscribed", subscribed: true });
        }

        await NewsletterModel.create({ email: trimmed });

        const mailResult = await sendNewsletterWelcomeEmail({ to: trimmed });
        if (!mailResult.success) {
            console.warn("Newsletter: welcome email failed for", trimmed, mailResult.error);
            // Don't fail subscription if mail fails
        }

        return res.status(201).json({ message: "Successfully subscribed", subscribed: true });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(200).json({ message: "Already subscribed", subscribed: true });
        }
        console.error("Newsletter subscribe error:", error);
        return res.status(500).json({ error: "Subscription failed" });
    }
};

export const list = async (req, res) => {
    try {
        const subscribers = await NewsletterModel.find({}).sort({ createdAt: -1 }).lean();
        return res.json(subscribers);
    } catch (error) {
        console.error("Newsletter list error:", error);
        return res.status(500).json({ error: "Failed to fetch subscribers" });
    }
};

export const send = async (req, res) => {
    try {
        const { subject, body } = req.body;
        const trimmedSubject = (subject || "").trim();
        const bodyContent = (body || "").trim();

        if (!trimmedSubject) {
            return res.status(400).json({ error: "Subject is required" });
        }

        const subscribers = await NewsletterModel.find({}).select("email").lean();
        if (!subscribers.length) {
            return res.status(400).json({ error: "No subscribers to send to" });
        }

        const htmlBody = bodyContent
            ? bodyContent.replace(/\n/g, "<br>")
            : "<p>No content.</p>";

        let successCount = 0;
        let failCount = 0;

        for (const sub of subscribers) {
            const result = await sendNewsletterCustomEmail({
                to: sub.email,
                subject: trimmedSubject,
                body: htmlBody
            });
            if (result.success) successCount++;
            else failCount++;
        }

        return res.json({
            message: `Sent to ${successCount} subscriber(s)`,
            sent: successCount,
            failed: failCount,
            total: subscribers.length
        });
    } catch (error) {
        console.error("Newsletter send error:", error);
        return res.status(500).json({ error: "Failed to send emails" });
    }
};
