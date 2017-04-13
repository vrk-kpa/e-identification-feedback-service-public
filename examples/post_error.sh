SCRIPTFILE=$(readlink -f "$0")
DIRNAME=$(dirname $SCRIPTFILE)
curl --cacert certs/test.crt -vX POST https://localhost:8443/ -d @"$DIRNAME/error-feedback.json" \
--header "Content-Type: application/json"
