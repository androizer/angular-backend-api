var express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    app = express();

// Middleware
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Server is accepting api calls');
});

app.get('/users/authenticate/:username/:password', (req, res) => {
    const username = req.params.username;
	// console.log('TCL: username', username);
    const pwd = req.params.password;
	// console.log('TCL: pwd', pwd);
    var result = null;
    fs.readFile('./assets/seeds/users.json', (error, data) => {
        if(!error) {
            const jsonData = JSON.parse(data);
            if (jsonData.length > 0 && Array.isArray(jsonData)) {
                for(let i = 0; i < jsonData.length; i++) {
                    // console.log('User --> ', jsonData[i]);
                    if (jsonData[i].username === username && jsonData[i].password === pwd) {
                        result = jsonData[i];
                        break;
                    }
                }
                if (result === null) {
                    res.send({data: null, statusCode: 404, message: 'Bad Request. No such user exists'});
                } else {
                    res.send({data: result, statusCode: 200, message: "Authenticate OK"});
                }
                console.log('Result Found --> ',result);
            }
        } else {
            res.send({data: null, statusCode: 500, message: "Internal Server Error"});
        }
    });
});

app.get('/users/list', (req, res) => {
    fs.readFile('./assets/seeds/company.json', (error, data) => {
        if (!error) {
            const jsonData = JSON.parse(data);
            if (jsonData.length > 0 && Array.isArray(jsonData)) {
                res.send({data: jsonData, statusCode:200, message:"Data Fetched"});
            } else {
                res.send({data: null, statusCode: 404, message: "Data Not Found"});
            }
        } else {
            res.send({data: null, statusCode:500, message: "Internal Server Error"});
        }
    });
});

app.listen(3000, () => {
    console.log('server listening at 3000');
});