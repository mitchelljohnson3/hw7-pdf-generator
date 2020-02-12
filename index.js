const inq = require ('inquirer');
const convertFactory = require ('electron-html-to');
const fs = require('fs');

// sets the conversion type target to be PDF
const conversion = convertFactory({
  converterPath: convertFactory.converters.PDF
});

// this function will take the github username, and fill the index.html file with the data
function fetchData(username) {
    const url = `https://api.github.com/users/${username}`
    fetch(username)
        .then( (response) => {
            return response.json();
        })
        .then( (json) => {
            fillData(json);            
        })
}

function fillData(json) {
    // fills index.html file with data

}

function convert(htmlFile) {
    // converts html file to pdf
    conversion({ html: '<h1>Hello World</h1>' }, function(err, result) {
        if (err) {
            return console.error(err);
        }
        
        console.log(result.numberOfPages);
        console.log(result.logs);
        result.stream.pipe(fs.createWriteStream('/path/to/anywhere.pdf'));
        conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
    });
}

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
    // this will call the fetchData function and then convert the index.html file into into a pdf using electron-pdf

})