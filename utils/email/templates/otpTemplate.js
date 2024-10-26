const OTP_TEMPLATE = (email, otp) => {
  return `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #e7f0fa;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 400px;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            margin: 50px auto;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .logo {
            width: 60px;
            height: auto;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            color: #333333;
            margin-top: 10px;
        }
        .content {
            padding: 20px;
        }
        .otp-section {
            font-size: 16px;
            color: #555555;
            margin-top: 20px;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            color: #333333;
            text-align: center;
            margin: 10px 0;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: #f9f9f9;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            color: #888888;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="cid:logo" alt="Logo" class="logo" />
            <h1 class="title">Mediclined</h1>
            <h2>Your OTP Code</h2>
        </div>
        <div class="content">
            <p>Dear <strong>${email}</strong>,</p>
            <p>Use the OTP code below to proceed with your action. This code is valid for a limited time and should not be shared with anyone.</p>
            <div class="otp-section">
                <div class="otp">${otp}</div>
            </div>
            <p>If you did not request this OTP, please disregard this email or contact our support team.</p>
            <p>Best regards,<br/>The Mediclined Team</p>
        </div>
        <div class="footer">
            &copy; 2024 Mediclined. All rights reserved.
        </div>
    </div>
</body>
</html>
  `;
};

module.exports = OTP_TEMPLATE;
