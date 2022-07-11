const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/../.env` });
const fs = require("fs");
const os = require("os");
const appRoot = require("app-root-path");



function writeNpmrcFile()
{
    const appRootPath = appRoot.resolve(".npmrc");
    const fileContents = `registry=https://registry.npmjs.org/${os.EOL}${process.env.PRIVATE_REGISTRY_SCOPE}:registry=${process.env.PRIVATE_REGISTRY_URL_TWO}${os.EOL}${process.env.PRIVATE_REGISTRY_PRE_AUTH_TOKEN}:_authToken=${process.env.PRIVATE_REGISTRY_AUTH_TOKEN}`;
    fs.writeFileSync(appRootPath, fileContents);
}



writeNpmrcFile();
