# soft tokens api

## Features
- **Framework**: Express
- **Authentication**: JWT with public/private key file, Diffie-Hellman key exchange
- **OTP**: TOTP and HOTP generation and verification
- **Database**: MongoDB, Redis
- **Code**: ESLint, Prettier, Husky
- **Debuging**: Debug, VS Code configurations
- **Logging**: Winston
- **Testing**: Jest, SuperTest, AutoCannon
- **Continuous Integration**: GitHub Actions + Docker Compose
- **Other**: PM2, DotEnv

## Getting Started

```shell

# Generate JWT keys
ssh-keygen -t rsa -b 2048 -q -N '' -m PEM -f private.key \
&& rm private.key.pub \
&& openssl rsa -in private.key -pubout -outform PEM -out public.key

# Install all dependencies
npm install

# Run on port 3000
npm start

```

## Structure

```
.
├── config                  # App configuration files
│   ├── index.js            # config
│   └── ...                 # Other configurations
├── db                      # Data access stuff
├── docs                    # Documentation
├── helpers                 # Helpers (formats, validation, etc)
├── services                # External services implementation  
│   ├── controllers         # Request managers
│   ├── middlewares         # Request middlewares
│   └── routes.js           # Define routes and middlewares here
├── scripts                 # Standalone scripts for dev uses
├── tests                   # Testing
├── .env                    # Environment variables
├── app.js                  # App starting point
├── Dockerfile              # Dockerfile
├── process.json            # pm2 init
├── package.json
└── README.md         
```

```shell

Case: HealthCheck Api 
EndPoint: http://localhost:4000/healthCheck
Method:GET
Response:{
    "uptime": 16,
    "message": "OK",
    "timestamp": "Mon, 11 May 2020 07:44:15 GMT"
}

Case: Sample Api 
EndPoint: http://localhost:4000/api
Method:GET
Response:{
    "httpCode": 200,
    "message": "The request has succeeded."
}

Case: Create User
Method:Post
EndPoint:http://localhost:4000/users
Body:{
  "email":"test@example.com"
}
Response:{
    "token": "eyJhbGciO...zSA8sQ"
}

Case: Update User
Method:Put
EndPoint:http://localhost:4000/users/test@example.com
Body:{
  "email":"test@example.com"
}
Response:{
    "token": "eyJhbGciO...zSA8sQ"
}

Case: Delete User
Method:Delete
EndPoint:http://localhost:4000/users/test@example.com
Body:{
}
Response:{
    
}

Case: Generate Key Pair
EndPoint: http://localhost:4000/keyPair
Method:GET
Body:{
}
Response:{
    "httpCode": 200,
    "message": "The request has succeeded.",
    "keys": {
        "publicKey": "Blu8pSFix3GHMZZSMsv0ynTblGvaabfVY8+R9wD+oH8=",
        "secretKey": "H/UVsPodEhteR5WivwVuTLpWiaXMHl3m9xV5a3J2+8E="
    }
}

Case: Generate Seeds
EndPoint: http://localhost:4000/seeds
Method:GET
Body:{
}
Response:{
    "httpCode": 200,
    "message": "The request has succeeded.",
    "seeds": {
        "totp": "JJ0YSiAlB9ZrGEt/GR/mQm2S4SJ3HSx13SJlLF61fuU=",
        "hotp": "iVfrJe/DHGeQKxsNkBUybWpI+XzvAQ/tj9R0gxLnQn4=",
        "counter": 1,
    }
}

Case: Encrypt Message
EndPoint: http://localhost:4000/encrypt
Method:POST
Body:{
	"message": {
        "email": "test@example.com",
        "mobile": "+601123345345",
        "fcm": "112233445566778899"
    },
	"clientSecretKey": "H/UVsPodEhteR5WivwVuTLpWiaXMHl3m9xV5a3J2+8E="
}
Response:{
    "httpCode": 200,
    "message": "The request has succeeded.",
    "encryptedMessage": "bUWd/vnMz9ARaz7VJ8mFEtTysTTl8jHZupcuT6Jw0K8+hZsZRbLOI0AU4nE0PCRKzYqzs3EOmOvrfz95t+QdGK2Z6kGv0wDJowQy/kZuO6x5LRm3uBMJvRB6oMixcSvsq8V5mwmWlRtdZKlR2fwEvVeY0GKL9ErM"
}

Case: Decrypt Message
EndPoint: http://localhost:4000/decrypt
Method:POST
Body:{
	"encryptedMessageWithNonce": "bUWd/vnMz9ARaz7VJ8mFEtTysTTl8jHZupcuT6Jw0K8+hZsZRbLOI0AU4nE0PCRKzYqzs3EOmOvrfz95t+QdGK2Z6kGv0wDJowQy/kZuO6x5LRm3uBMJvRB6oMixcSvsq8V5mwmWlRtdZKlR2fwEvVeY0GKL9ErM",
	"clientPublicKey": "Blu8pSFix3GHMZZSMsv0ynTblGvaabfVY8+R9wD+oH8="
}
Response:{
    "httpCode": 200,
    "message": "The request has succeeded.",
    "decryptedMessage": {
        "email": "test@example.com",
        "mobile": "+601123345345",
        "fcm": "112233445566778899"
    }
}

Case: Generate OTP - TOTP or HOTP
EndPoint: http://localhost:4000/otp/generate
Method:POST
Body:{
	"seed":"JJ0YSiAlB9ZrGEt/GR/mQm2S4SJ3HSx13SJlLF61fuU=",
	"otp": "totp",
}
Response:{
    "httpCode": 200,
    "message": "The request has succeeded.",
    "token": "783419"
}

Case: Verify OTP - TOTP or HOTP
EndPoint: http://localhost:4000/otp/verify
Method:POST
Body:{
	"token":"783419",
	"otp": "totp",
}
Response:{
    "httpCode": 200,
    "message": "The request has succeeded.",
    "valid": true
}


Case: Token publicKey
EndPoint: http://localhost:4000/tokens/publicKey
Method:GET
Body:{
}
Response:{
    "httpCode": 200,
    "message": "The request has succeeded.",
    "publicKey": "G+qbld9lWWU5aKaHcYTS/WWu888Egy4pI/okNI4ZAHs="
}

Case: Token Register
EndPoint: http://localhost:4000/tokens/register
Method:POST
Body:{
	"encryptedMessageWithNonce": "bUWd/vnMz9ARaz7VJ8mFEtTysTTl8jHZupcuT6Jw0K8+hZsZRbLOI0AU4nE0PCRKzYqzs3EOmOvrfz95t+QdGK2Z6kGv0wDJowQy/kZuO6x5LRm3uBMJvRB6oMixcSvsq8V5mwmWlRtdZKlR2fwEvVeY0GKL9ErM",
	"clientPublicKey": "Blu8pSFix3GHMZZSMsv0ynTblGvaabfVY8+R9wD+oH8="
}
Response:{
    "httpCode": 200,
    "message": "The request has succeeded.",
    "decryptedMessage": {
        "email": "test@example.com",
        "mobile": "+601123345345",
        "fcm": "112233445566778899"
    },
    "seeds": {
        "totp": "JJ0YSiAlB9ZrGEt/GR/mQm2S4SJ3HSx13SJlLF61fuU=",
        "hotp": "iVfrJe/DHGeQKxsNkBUybWpI+XzvAQ/tj9R0gxLnQn4=",
        "counter": 1
    }
}


Case: Challenge Generate
EndPoint: http://localhost:4000/challenges/generate
Method:POST
Body:{
	"encryptedMessageWithNonce": "hZxPYmtu6XrwEJR24WolBa5i0tF8xaj9iJI3oNCjlclMzpLOSs2KNQKs9cEDTZySubjw54lt7TwJMxmHIXdso4/rN3TnzR8yLadeDp0/mnvUcNU3U6EuoJqKFWz2Twu4XK+pk0+2d4BSV+TIDZSx/xHhltzWZIM5Ahv9V/FV3uagfcqdASeAiAav48JzhyBURlwohj5o8MAI2hkXxRBz8ON9Zu1+vORHnWHVfF6Qw1KcDAPUFKunmMg0BnqxAGTjA9qhuofkRSL0x+WX0M/taSVTqzctmW7UNGn4ubghyb81TUK7IllIBkUmmFHdTtvFw2n8B99PD/q2s4ugrXe9mLa021XL8/X+dQTwB9NfLOi0t92iab4U9AiYQGqSCeYQlxRoH95JdTNiKM8=",
	"clientPublicKey": "Blu8pSFix3GHMZZSMsv0ynTblGvaabfVY8+R9wD+oH8="
}
Response:{
    "httpCode": 200,
    "message": "The request has succeeded.",
    "challengeMessage": {
        "email": "test@example.com",
        "challenge": {
            "detailsId": "123456789",
            "details": [
                {
                    "title": "from account",
                    "display": "123456"
                },
                {
                    "title": "to account",
                    "display": "654321"
                },
                {
                    "title": "amount",
                    "display": "12.00"
                }
            ],
            "notes": [
                {
                    "title": "note title",
                    "display": "note display"
                }
            ]
        },
        "hash": "ZIbWIPzESqgYdbjjn1VcxqUi0j4C9ZdakOhIPj5bc3rP1xffr3VQrmHG6xXjjA4QqhVI85dwEXOKYGBts0Hh6g==",
        "id": "5ec4d2f0f0caf8df80ec3ae2"
    }
}

Case: Challenge Verify with TOTP or HOTP
EndPoint: http://localhost:4000/challenges/verify
Method:POST
Body:{
	"encryptedMessageWithNonce": "jPzvHzztRPbhuWkzps/KQWjvzYYsSnRVXzEZwNhvrZL5bcD2/Ls76TdH0fbeAwD1XrmDE4TkysVIwZ5cTooGY7c1MkBq4s56Yi7Kor68XSD6HKyV+oYgKhciWfBgPzONBYHTBXQBWqJ+X48uWZGwsReRYgKwUIiZueQeB3kIvIyg0CKQkoNpe++do+cCewD2xOxBTXpY1BTqbGax3S8OTcTW0I65Gux0AAwbsVRSNauzsqU/K9tWPNyJmpu8fTivaIzHEUSBarMM9lBhHpDOAGUI6w8xIuy8DMEII++5BN1Sq73LI2J1STda543A0xhLiKF4WV+g2b/prU7Ze5zTLfu+1UNa3LK0/gevsaVtuagxGnvzXZBEt9o9RejSOyvP2Ww5HQLENaODREngv5WOdeyQCl1IAw2wDlmWo3h+R2dDGCoydQfqIU9t7rlAXAyyIBTQCgsPqoPZM4sNzaFYRQCefU4WduRaxdMK27jotRm5xogTGJ7Muk42h/mFygqQw3wjU1YoQNK0ugpFM1K8aiZTgbA=",
	"clientPublicKey": "Blu8pSFix3GHMZZSMsv0ynTblGvaabfVY8+R9wD+oH8=",
	"otp": "hotp",
	"token": "896342",
	"counter": 1
}
Response:{
    "httpCode": 200,
    "message": "The request has succeeded.",
    "tokenMatch": false,
    "hashMatch": true
}

```

### Todo

- [x] totp and hotp api 
- [x] jwt authentication
- [x] user registration 
- [ ] pin api
- [ ] gsm token validation 
- [ ] redis cluster 
- [ ] react native app 
- [ ] app pin protection 
- [ ] QR generator and scanner
