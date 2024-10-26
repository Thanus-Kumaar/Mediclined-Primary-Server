const TEMPLATE_PASSWORD_RESET = (email, newPassword) => {
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
          .new-password-section {
              font-size: 16px;
              color: #555555;
              margin-top: 20px;
          }
          .new-password {
              font-size: 18px;
              font-weight: bold;
              color: #333333;
              text-align: center;
              margin: 10px 0;
              padding: 8px;
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
          .login-button {
              display: block;
              width: 100%;
              margin: 20px 0;
              padding: 10px;
              background-color: #007bff;
              color: #ffffff;
              text-decoration: none;
              text-align: center;
              border-radius: 4px;
              font-weight: bold;
          }
          .login-button:hover {
              background-color: #0056b3;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <img src="cid:logo" alt="Logo" class="logo" />
              <h1 class="title">Mediclined</h1>
              <h2>Password Reset</h2>
          </div>
          <div class="content">
              <p>Dear <strong>${email}</strong>,</p>
              <p>We received a request to reset your password. Here is your updated password:</p>
              <div class="new-password-section">
                  <div class="new-password">New Password: ${newPassword}</div>
              </div>
              <a href="https://your-login-page-link.com" class="login-button">LOGIN</a>
              <p>If you did not request this change, please contact our support team immediately.</p>
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
  
  module.exports = TEMPLATE_PASSWORD_RESET;
  