const Express = require("express");
const BodyParser = require("body-parser");
const Speakeasy = require("speakeasy");

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));


app.post("/totp-secret", (request, response, next) => {
    var secret = Speakeasy.generateSecret({ length: 20 });
    response.send({ "Secret": secret.base32 });
});

app.post("/totp-generate", (request, response, next) => {
    response.send({
        "token": Speakeasy.totp({
            secret: request.body.secret,
            encoding: "base32"
        }),
        "remainning": (60 - Math.floor((new Date().getTime() / 1000.0 % 60)))
    });

});

app.post("/totp-validate", (request, response, next) => {
    response.send({
        "valid": Speakeasy.totp.verify({
            secrete: request.body.secret,
            encoding: "base32",
            token: request.body.token,
            window: 0,
        })
    })
})
app.listen(3000, () => {
    console.log("Listening at :3000....");
})