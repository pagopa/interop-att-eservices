# client-anpr-residence-verification-mockup

This tool is useful for generating tokens when running locally for testing purposes.

## Getting Started

1. **Add your private key**  
    Place your private key file in the `keys` folder. The file must have the `.rsa.priv` extension.

2. **Check environment variables**  
Set the following environment variables in your shell or in a `.env` file before running the tool:

```env
USERID=to be retrived from selfcare
LOCATIONID=lap-mbp16-n02-0387
LOA=LoA23 #spid

PRIVATE_KEY_PATH=./keys/path_to_your private key (.rsa.priv)
KID=to be retrived from selfcare service client 

ALG=RS256
TYP=JWT
CLIENT_ID=to be retrived from selfcare service client 

ESERVICE_AUDIENCE=to be retrived from selfcare service client 
ESERVICE_ENDPOINT=to be retrived from selfcare service client 
TOKEN_ENDPOINT=to be retrived from selfcare service client voucher details
AUTH_AUDIENCE=to be retrived from selfcare service client
PURPOSE_ID=to be retrived from selfcare "finalità"
PORT=the port you want to run the service on
```

3. **Install dependencies**
    ```bash
    pnpm install
    ```

4. **Build**
    ```bash
    pnpm build
    ```
5. **Start**
    ```bash
    pnpm start
    ```

6. **Usage with Postman**
    ```
        Set a POSTMAN Environment with the following variables:
        - pdnd_token
        - signature
        - tracking
        
        Create a post request with the body of the request you want to test.
        
        Once you obtain the tokens and the following headers to the request you want to test:

        agid-jwt-signature:             {{signature}}
        agid-jwt-trackingevidence:      {{tracking}}
        Authorization:                  Bearer {{pdnd_token}}
        x-correlation-id:               random uuid (5c1fb437-4902-46ea-93e3-064bbed4e0d0)
        content-encoding:               identity

    ```


## Notes

- Ensure your private key is never committed to version control.
- This tool is intended for local development and testing only.