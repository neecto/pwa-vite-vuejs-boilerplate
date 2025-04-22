# Power Web App boilerplate powered by Vite and using VueJS as SPA framework

This is a boilerplate project setup for local development and testing of a PWA project. I want to have it for myself for future reference.

## Pre-requisites

The repo's content meets [PWA minimal requirements](https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html) but in order to be able to install this app on devices, it needs to be served over HTTPS with a valid (trusted on your local machine) SSL certificate. Here are the steps to generate it (thanks to this [gist](https://gist.github.com/klcantrell/518d13d59c4074dbca6310c9b7e6c520) which I almost duplicate here except for some minor tweaks):

### Step 0

You will need to install `openssl`. I got Windows version from [here](https://slproweb.com/products/Win32OpenSSL.html). Then open terminal in the folder you want to have all your SSL-related files. I used an `ssl` folder in the repo root which it gitignored.

### Step 1

Generate private root key

```
openssl genrsa -des3 -out myCA.key 2048
```

### Step 2

Generate a root certificate

```
openssl req -x509 -new -nodes -key myCA.key -sha256 -days 1825 -out myCA.pem
```

### Step 3

Bundle root certificate and private key into a format that can be uploaded into Trusted Root Certification Authorities.

```
openssl pkcs12 -inkey myCA.key -in myCA.pem -export -out certificate.p12
```

### Step 4

Import `certificate.p12` into Trusted Root Certification Authorities of Windows Certificates.

### Step 5

Create a private key for a dev server that will host our PWA. `localhost` in `localhost.key` and in other files in commands below can be any other any name, it only matters when referencing this file in other commands.

```
openssl genrsa -out localhost.key 2048
```

### Step 6

Create a certificate signing request (CSR) for a our dev server that will support HTTPS.

```
openssl req -new -key localhost.key -out localhost.csr
```

### Step 7

Create a Subject Alternative Name extension to `.ext` file (e.g. `localhost.ext`) which will be used along with the key from `Step 5` and CSR from `Step 6` to generate a site specific certificate. Use `IP.x` in `[alt_names]` for adding your local network IP if you intend to test on your mobile devices, for example.

```
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
IP.1 = 192.168.0.100
```

### Step 8

Generate the certificate for a our dev server.

```
openssl x509 -req -in localhost.csr -CA myCA.pem -CAkey myCA.key -CAcreateserial
-out localhost.crt -days 1825 -sha256 -extfile localhost.ext
```

### Step 9 (optional)

If you need to change any configuration for your local server certificate e.g. change the IP address, just re-run the steps 7 and 8.

### Step 10 (optional)

If you intend to test on mobile devices, you may want to trust your generated certificate on those devices as well (but for me it wasn't necessary to install PWA on the iPhone).

## Running the app

### Build the project

```
npm run build
```

### Run the HTTP server

This is using `http-server` npm packages. I recommend running it in a separate terminal, otherwise you'll need to open a new terminal to re-build.

```
npx http-server dist -S -C ssl\localhost.crt -K ssl\localhost.key
```

Open the hosted app in your browser.

### Build again

Change something in the project and run the build command again

```
npm run build
```

If everything works you should see the message notifying about an app update and `Reload` button.

## Development

For development purposes, use `npm run dev` for HMR, as usual.
