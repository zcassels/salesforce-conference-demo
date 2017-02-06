var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    shortid = require('shortid'),
    app = express(),

    appId = process.env.APP_ID;

console.log(appId);

var token_cache = {};
var config_cache = {};

app.use(bodyParser.json());
app.use(express.static(__dirname + '/client'));

app.get('/appid', function(req, res) {
    res.send({appId: appId});
});

app.get('/api/configs', function(req, res) {
    getUserContext(req,
    function(user) {
        var configs = getConfigs(user.user_id);
        res.send(configs);
    }, function(error) {
        res.status(401).send({message: "Not Authorized"});
    });
});

app.post('/api/configs', function(req, res) {
    getUserContext(req,
    function(user) {
        var config = addConfigToUser(user.user_id, req.body);
        res.send(config);
    }, function(error) {
        res.status(401).send({message: error});
    });
});

function addConfigToUser(userId, config) {
    config["id"] = shortid.generate();
    var configs = getConfigs(userId);
    configs.push(config);
}

function getConfigs(userId) {
    if (config_cache[userId] === undefined) {
        config_cache[userId] = [];
    }

    return config_cache[userId];
}

function getUserContext(req, success, failure) {
    if (req.header('Authorization') === null || req.header('Authorization').split("Bearer ").length !== 2) {
        failure("No oauth token present");
        return;
    }

    var oauth_header = req.header('Authorization').split("Bearer ")[1];;
    var user = getUserFromToken(oauth_header);
    if (user === null) {
        failure("Could not find user from session");
        return;
    } 
        
    success(user);
}

app.all('*', function (req, res, next) {
    var targetURL = req.header('Target-URL');
    if (!targetURL) {
        res.send(500, { error: 'There is no Target-Endpoint header in the request' });
        return;
    }
    request({ url: targetURL + req.url, method: req.method, json: req.body, headers: {'Authorization': req.header('Authorization')} },
        function (error, response, body) {
            if (error) {
                console.error('error: ' + response.statusCode)
            } else {
                var auth = response.req.getHeader("Authorization");
                if (auth !== null && auth.split("Bearer ").length === 2) {
                    var token = response.req.getHeader("Authorization").split("Bearer ")[1];
                    addToken(token, body);
                }
                console.log('proxied request complete');
            }
        }).pipe(res);
});

function addToken(token, authBody) {
    token_cache[token] = authBody;
}

function getUserFromToken(token) {
    if (token in token_cache) {
        return token_cache[token];
    }

    // make SF request to check token if not in cache

    return null;
}

app.set('port', process.env.PORT || 8200);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});