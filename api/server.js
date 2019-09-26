const express = require('express');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser')
const cors = require('cors');

const Constants = require('./config');
const Entry = require('./entry');

const app = express();
const corsOptions = {
    // TODO secure against other origins
    origin: (origin, callback) => callback(null, true),
    credentials: true
}
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

const validUserids = ['monica', 'nicole', 'jim', 'felicia', 'cailyn', 'elli', 'bruce', 'patrick']
function validateCredentials(token) {
    const [userid, password] = token.split(":");
    return (password === process.env.API_PASSWORD && validUserids.indexOf(userid) >= 0);
}

app.use('/login', (req, res) => {
    const token = req.header("X-Auth-Token");
    if (!token) {
        res.set("Content-Type", "application/json")
        return res.status(401).send({
            error: "No authorization data"
        });
    }
    const validToken = validateCredentials(token);
    if (!validToken) {
        res.set("Content-Type", "application/json");
        return res.status(403).send({
            error: "Invalid password"
        });
    }
    res.status(200).cookie('auth-token', token).send();
});
app.use((req, res, next) => {
    const token = req.cookies && req.cookies['auth-token'];
    if (!token) {
        res.set("Content-Type", "application/json");
        return res.status(401).send({
            error: "Unauthenticated"
        });
    }
    const validToken = validateCredentials(token);
    if (!validToken) {
        res.set("Content-Type", "application/json");
        return res.status(403).send({
            error: "Invalid password"
        });
    }
    res.locals.userid = token.split(":")[0];
    next();
});

const router = express.Router();
Entry.useRoutes(router);
app.use('/api', router);

app.listen(Constants.API_PORT, () => console.log(`App is listening on port ${Constants.API_PORT}!`));
