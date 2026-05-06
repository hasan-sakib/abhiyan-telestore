import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.config import settings


def send_email(to: str, subject: str, html_body: str) -> None:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.MAIL_FROM
    msg["To"] = to
    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP(settings.MAIL_SERVER, settings.MAIL_PORT) as server:
        server.ehlo()
        server.starttls()
        server.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
        server.sendmail(settings.MAIL_FROM, to, msg.as_string())


def send_password_reset_email(email: str, reset_token: str) -> None:
    reset_url = f"{settings.FRONTEND_URL}/auth/reset-password?token={reset_token}"
    html = f"""
    <html><body>
    <h2>Reset Your Password</h2>
    <p>Click the link below to reset your password. This link expires in 24 hours.</p>
    <a href="{reset_url}" style="
        display:inline-block;padding:12px 24px;background:#6366f1;
        color:white;text-decoration:none;border-radius:6px;font-weight:bold;">
        Reset Password
    </a>
    <p>If you did not request this, ignore this email.</p>
    </body></html>
    """
    send_email(email, "Reset your Abiyan Telestore password", html)
