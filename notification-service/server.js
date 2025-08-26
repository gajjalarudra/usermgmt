import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import AWS from "aws-sdk";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const region = process.env.AWS_REGION || "eu-west-1";
AWS.config.update({ region });

const ses = new AWS.SES({ apiVersion: "2010-12-01" });
const sns = new AWS.SNS({ apiVersion: "2010-03-31" });

const hasAwsCreds = Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);

app.get("/health", (req, res) =>
  res.json({ ok: true, service: "notification-service", aws: hasAwsCreds })
);

app.post("/notify", async (req, res) => {
  const { subject, message } = req.body || {};
  if (!message) return res.status(400).json({ error: "message is required" });

  const responses = { dryRun: !hasAwsCreds };

  try {
    if (hasAwsCreds && process.env.SENDER_EMAIL) {
      const emailParams = {
        Source: process.env.SENDER_EMAIL, // ✅ verified sender
        Destination: { ToAddresses: [process.env.SENDER_EMAIL] }, // ✅ also verified recipient
        Message: {
          Subject: { Data: subject || "Notification" },
          Body: { Text: { Data: message } },
        },
      };
      const sesResp = await ses.sendEmail(emailParams).promise();
      responses.sesMessageId = sesResp.MessageId;
    } else {
      console.log(`[DRY_RUN][SES] would send email to ${process.env.SENDER_EMAIL}: ${subject} - ${message}`);
    }

    if (hasAwsCreds && process.env.SNS_TOPIC_ARN) {
      const snsResp = await sns.publish({
        TopicArn: process.env.SNS_TOPIC_ARN,
        Message: JSON.stringify({ subject, message, ts: Date.now() }),
      }).promise();
      responses.snsMessageId = snsResp.MessageId;
    } else {
      console.log(`[DRY_RUN][SNS] would publish message: ${subject} - ${message}`);
    }

    res.json({ ok: true, ...responses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Notification failed", details: err.message });
  }
});


const port = 3002;
app.listen(port, () => console.log(`notification-service listening on ${port}`));
