#!/bin/bash
echo "Generating self-signed certificates..."
openssl genrsa -out ./config/sslcerts/key.pem -aes256 1024
openssl req -new -key ./config/sslcerts/key.pem -out ./config/sslcerts/csr.pem
openssl x509 -req -days 9999 -in ./config/sslcerts/csr.pem -signkey ./config/sslcerts/key.pem -out ./config/sslcerts/cert.pem
rm ./config/sslcerts/csr.pem
# resolve issue with bad password...
# Error: error:0906A068:PEM routines:PEM_do_header:bad password read
# reference: http://blog.mgechev.com/2014/02/19/create-https-tls-ssl-application-with-express-nodejs/
openssl rsa -in ./config/sslcerts/key.pem -out ./config/sslcerts/newkey.pem && mv ./config/sslcerts/newkey.pem ./config/sslcerts/key.pem
chmod 0400 ./config/sslcerts/key.pem ./config/sslcerts/cert.pem
