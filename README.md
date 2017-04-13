# e-identification-feedback-service

Service that receives HTTP POSTs created by Feedback page and Error feedback page 
and forwards the data as an email.

### Local development and test use

To see what is going on, run:
```
npm install
# start debug SMTP server (won't send email, instead logs to console)
python -m smtpd -nc DebuggingServer localhost:8825 &
# start feedback development server using config.yml
npm run dev_server &
# make feedback HTTP POST
examples/post_feedback.sh
# make error feedback HTTP POST
examples/post_error.sh
```

In case you need new test cert, run:
```
openssl req -new -newkey rsa:1024 -days 365 -nodes -x509 \
   -subj '/C=FI/O=VRK/OU=Org/CN=localhost' \
   -keyout certs/test.key -out certs/test.crt
```
