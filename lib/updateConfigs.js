import fs from "fs";

export function updateConfigs(projectName) {
  fs.writeFileSync(
    "turbo.json",
    JSON.stringify(
      {
        $schema: "https://turborepo.org/schema.json",
        globalDependencies: [".env"],
        tasks: {
          build: {
            dependsOn: ["^build"],
            outputs: ["dist/**", ".next/**"],
          },
          dev: {
            cache: false,
          },
          prod: {
            cache: false,
          },
        },
      },
      null,
      2
    )
  );

  fs.writeFileSync(
    ".env",
    `# Frontend Base Url
REACT_APP_BASE_URL=http://localhost:5173

# Backend port
PORT=5000

# Backend env
NODE_ENV=prod #(prod | test | staging)

# Database
DB_HOST=
DB_NAME=
DB_PORT=
DB_USER=
DB_PASS=
DB_DIALECT=
DB_CERT=

# JWT
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRATION=1h

# URL
URL_TOKEN_SECRET=
URL_TOKEN_EXPIRATION=7d

# AWS
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET_NAME=
AWS_S3_PATH=
AWS_S3_SIGNED_URL_EXPIRATION=

# Email service
SMTP_HOST=
SMTP_USER=
SMTP_PASSWORD=
FROM_MAIL=
`
  );
}
