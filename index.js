const inq = require ('inquirer');
const convertFactory = require ('electron-html-to');
const axios = require('axios');
const fs = require('fs');

// sets the conversion type target to be PDF
const conversion = convertFactory({
  converterPath: convertFactory.converters.PDF
});

// this function will take the github username, and fill the index.html file with the data
function fetchData(answers) {
    const url = `https://api.github.com/users/${answers.username}`
    // fetches data from url
    axios.get(url)
        .then( (json) => {
            fillData(json.data, answers.color);
        })
}

function fillData(json, userColor) {
    // fills index.html file with data
    const location = json.location.split(' ').join('+');
    const template = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User Profile PDF</title>
    </head>
    <body>
        <img src="${json.avatar_url}">
        <h1>${json.login}</h1>
        <ul>
            <li><a href="https://www.google.com/maps/place/${location}">https://www.google.com/maps/place/${location}</a></li>
            <li><a href="${json.html_url}">${json.html_url}</a></li>
            <li><a href="https://${json.blog}">https://${json.blog}</a></li>
        </ul>
        <h2>${json.bio}</h2>
        <h3>${json.public_repos} repositories</h3>
        <h3>${json.followers} followers</h3>
        <h3>${json.public_gists} github stars</h3>
        <h3>following ${json.following} users</h3>
    
        <style>
            body{
                background-color: ${userColor};
            }
        </style>
    </body>
    </html>`;
    convert(template);
}

function convert(htmlFile) {
    // converts html file to pdf
    fs.writeFile('profile.html', htmlFile, (err) => {
        if(err){
            throw err;
        }
    })
}

const init = async function(questions) {
    const htmlFile = await fetchData(questions);
};

inq.prompt(
    [{
        message: 'github username?',
        name: 'username'
    },
    {
        message: 'favorite color?',
        name: 'color'
    }]
).then( (questions) => {
    // this will initialize the program
    init(questions);
})