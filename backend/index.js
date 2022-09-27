const sdk = require("hellosign-sdk")({
  key: "YOUR-API-KEY",
});
const express = require("express");
const app = express();
const port = 3333;
const applyCustomBranding = async () => {
  await sdk.apiApp.update("YOUR-CLIENT-ID", {
    white_labeling_options: JSON.stringify({
      header_background_color: "#1A1A1A",
      legal_version: "terms1",
      link_color: "#00B3E6",
      page_background_color: "#F7F8F9",
      primary_button_color: "#00B3E6",
      primary_button_color_hover: "#00B3E6",
      primary_button_text_color: "#FFFFFF",
      primary_button_text_color_hover: "#FFFFFF",
      secondary_button_color: "#FFFFFF",
      secondary_button_color_hover: "#FFFFFF",
      secondary_button_text_color: "#00B3B6",
      secondary_button_text_color_hover: "#00B3B6",
      text_color1: "#808080",
      text_color2: "#FFFFFF",
    }),
  });
};

app.post("/callback", (request, response) => {
  response.send("Hello API Event Received");
});
app.get("/signature-request", async (request, response) => {
  const embeddedWithTemplateResponse =
    await sdk.signatureRequest.createEmbeddedWithTemplate({
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
    });
  const signatureId =
    embeddedWithTemplateResponse.signature_request.signatures[0].signature_id;
  const signUrlResponse = await sdk.embedded.getSignUrl(signatureId);

  response.json({ url: signUrlResponse.embedded.sign_url });
});

app.listen(port, () => {
  console.log("Listening on", port);
  applyCustomBranding().then(() => {
    console.log("Applied custom branding");
  });
});
