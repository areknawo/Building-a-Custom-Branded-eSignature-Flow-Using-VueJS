const sdk = require("hellosign-sdk")({ key: "YOUR-API-KEY" });
const express = require("express");
const app = express();
const port = 3333;

app.post("/callback", (request, response) => {
    response.send("Hello API Event Received");
});
app.get("/signature-request", async (request, response) => {
    const embeddedWithTemplateResponse = await sdk.signatureRequest.createEmbeddedWithTemplate(
        {
            test_mode: 1,
            clientId: "YOUR-CLIENT-ID",
            template_id: "YOUR-TEMPLATE-ID",
            title: "NDA",
            subject: "NDA",
            message: "Please sign this NDA so we can continue the work",
            signers: [
                {
                    email_address: "employee@example.com",
                    name: "Employee Name",
                    role: "Employee",
                },
            ],
        }
    );
    const signatureId =
        embeddedWithTemplateResponse.signature_request.signatures[0].signature_id;
    const signUrlResponse = await sdk.embedded.getSignUrl(signatureId);

    response.json({ url: signUrlResponse.embedded.sign_url });
});

app.listen(port, () => {
    console.log("Listening on", port);
});

