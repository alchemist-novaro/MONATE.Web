namespace MONATE.Web.Server.Helpers
{
    using MailKit.Net.Smtp;
    using MailKit;
    using MimeKit;
    using MailKit.Net.Proxy;

    public static class VerifyEmailHelper
    {
        private static readonly Dictionary<string, string> verifyValueDict = new Dictionary<string, string>();
        private static object lockVerifyValueDict = new object();

        public static bool SendVerificationCode(string email)
        {
            string code = GenerateRandom6DigitString();
            string subject = "Your Verification Code";
            string body = $"Welcome to MONATE website!!!\n\nYour verification code is: **{code}**.\n\nPlease enter this code to verify your account.\n\nThank you!";
            string myEmail = Environment.GetEnvironmentVariable("EMAIL_ADDRESS") ?? string.Empty;
            string myEmailPassword = Environment.GetEnvironmentVariable("EMAIL_PASSWORD") ?? string.Empty;
            string mySmtpHost = Environment.GetEnvironmentVariable("SMTP_HOST") ?? string.Empty;
            int mySmtpPort = int.Parse(Environment.GetEnvironmentVariable("SMTP_PORT") ?? string.Empty);

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("MONATE", myEmail));
            message.To.Add(new MailboxAddress("", email));
            message.Subject = subject;

            message.Body = new TextPart("plain")
            {
                Text = body,
            };

            using (var client = new SmtpClient(new ProtocolLogger("smtp.log")))
            {
                try
                {
                    client.Connect(mySmtpHost, mySmtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                    client.Authenticate(myEmail, myEmailPassword);
                    client.Send(message);

                    lock (lockVerifyValueDict)
                    {
                        verifyValueDict[email] = code;
                    }
                    return true;
                }
                catch
                {
                    return false;
                }
                finally
                {
                    client.Disconnect(true);
                }
            }
        }

        public static bool VerifyEmail(string email, string code)
        {
            lock (lockVerifyValueDict)
            {
                if (!verifyValueDict.ContainsKey(email)) { return false; }
                if (verifyValueDict[email] != code) { return false; }
                return true;
            }
        }

        private static string GenerateRandom6DigitString()
        {
            Random random = new Random();
            int number = random.Next(100000, 1000000); // Generates a number between 100000 and 999999
            return number.ToString();
        }
    }
}
