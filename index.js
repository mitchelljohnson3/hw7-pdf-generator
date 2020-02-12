const inq = require ('inquirer');
const convertFactory = require ('electron-html-to');
const fs = require('fs');

// sets the conversion type target to be PDF
const conversion = convertFactory({
  converterPath: convertFactory.converters.PDF
});

// this function will take the github username, and fill the index.html file with the data
function fetchData(answers) {
    const url = `https://api.github.com/users/${answers.username}`
    // gotta use axios buddy
    fetch(url)
        .then( (response) => {
            return response.json();
        })
        .then( (json) => {
            return fillData(json, answers.color);            
        })
}

function fillData(json, userColor) {
    // fills index.html file with data
    const template = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <img src="${imageUrl}">
        <h1>${json.login}</h1>
        <ul>
            <li><a href="${userLocationUrl}">${userLocationUrl}</a></li>
            <li><a href="${json.html_url}">${json.html_url}</a></li>
            <li><a href="${json.blog}">${json.blog}</a></li>
        </ul>
        <h2>${json.bio}</h2>
        <h3>${numRepos} repositories</h3>
        <h3>${numRepos} followers</h3>
        <h3>${numRepos} github stars</h3>
        <h3>following ${numRepos} users</h3>
    
        <style>
            body{
                background-color: ${userColor};
            }
        </style>
    </body>
    </html>`;

    return template;
}

function convert(htmlFile) {
    // converts html file to pdf
    conversion({ html: htmlFile }, function(err, result) {
        if (err) {
            return console.error(err);
        }
        
        console.log(result.numberOfPages);
        console.log(result.logs);
        result.stream.pipe(fs.createWriteStream('/path/to/anywhere.pdf'));
        conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
    });
}

const init = async function(questions) {
    const htmlFile = await fetchData(questions);
};

inq.prompt(
    {
        message: 'github username?',
        name: 'username'
    },
    {
        message: 'favorite color?',
        name: 'color'
    }
).then( (questions) => {
    // this will initialize the program
    init(questions);
})