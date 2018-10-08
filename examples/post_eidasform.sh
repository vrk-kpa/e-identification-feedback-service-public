SCRIPTFILE=$(readlink -f "$0")
DIRNAME=$(dirname $SCRIPTFILE)
curl --cacert certs/test.crt -vX POST https://localhost:8443/eidas -d @"$DIRNAME/eidasform.json" \
--header "Content-Type: application/json"
