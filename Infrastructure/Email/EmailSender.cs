using Resend;

namespace Infrastructure.Email
{
    public class EmailSender
    {
        private readonly IResend _resend;

        public EmailSender(IResend resend)
        {
            _resend = resend;
        }

        public async Task SendEmailAsync(string userEmail, string emailSubject, string msg)
        {
            var message = new EmailMessage();
            message.From = "primotibalt <onbording@resend.dev>";
            message.To.Add("anton.shheglov.1@gmail.com");
            message.Subject = emailSubject;
            message.HtmlBody = msg;

            await _resend.EmailSendAsync(message);
        }
    }
}