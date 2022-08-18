var axios = require('axios');
var qs = require('qs');
const cheerio = require('cheerio')
const people = [] //puts peoples information into this array
function responseHandler(response){
    const HTML = JSON.stringify(response.data);
    const $ = cheerio.load(HTML)
    var n = 2
    while(true){
        var license  = $('form > table > tbody > tr > td > table > tbody > tr:nth-child(6) > td > table > tbody > tr:nth-child('+n+') > td:nth-child(1) > font').text()
        var name  = $('form > table > tbody > tr > td > table > tbody > tr:nth-child(6) > td > table > tbody > tr:nth-child('+n+') > td:nth-child(2) > font > a').text()
        if(name==='') break  //checks that it hasn't reached end of county
        var type  = $('form > table > tbody > tr > td > table > tbody > tr:nth-child(6) > td > table > tbody > tr:nth-child('+n+') > td:nth-child(3) > font').text()
        var licenseNum  = $('form > table > tbody > tr > td > table > tbody > tr:nth-child(6) > td > table > tbody > tr:nth-child('+n+') > td:nth-child(4) > font').text()
        var status  = $('form > table > tbody > tr > td > table > tbody > tr:nth-child(6) > td > table > tbody > tr:nth-child('+n+') > td:nth-child(1) > font').html()
        n+=1 //shifts nth-child
        var licenseAddress = $('form > table > tbody > tr > td > table > tbody > tr:nth-child(6) > td > table > tbody > tr:nth-child('+n+') > td > table > tbody > tr:nth-child(1) > td:nth-child(2) > font').text()
        var mainAddress = $('form > table > tbody > tr > td > table > tbody > tr:nth-child(6) > td > table > tbody > tr:nth-child('+n+') > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > font').text()
        if(mainAddress===''){ //if there is no license address main address takes spot of license address, this corrects that
            mainAddress = licenseAddress
            licenseAddress=''

        }
        const person = JSON.stringify({license, name, type, licenseNum, status,licenseAddress,mainAddress})
        //console.log(person)
        people.push(person)        
        n+=1 //shifts to next person
    }
}
async function county(number) {
    var data = qs.stringify({
    'hSearchType': 'LicTyp',
    'hSearchOpt': 'Organization',
    'hSearchAltName': 'Alt',
    'hDivision': 'ALL',
    'hBoard': '25',
    'hLicenseType': '2501',
    'hCity': 'Orlando',
    'hCounty': number,
    'hState': 'FL',
    'Board': '25',
    'LicenseType': '2501',
    'City': 'Orlando',
    'County': number,
    'State': 'FL',
    'RecsPerPage': '50' 
    });
    var config = {
    method: 'post',
    url: 'https://www.myfloridalicense.com/wl11.asp?mode=2&search=LicTyp&SID=&brd=&typ=',
    headers: { 
        'Content-Type': 'application/x-www-form-urlencoded', 
        'Cookie': 'ASPSESSIONIDQQQSBRRB=ONAMIOCDJFIBACPGEPODPFNO'
    },
    data : data
    };
    axios(config)
    .then(responseHandler)
    .catch(function (error) {
    console.log(error);
    });
}
async function main(){
    for(var i = 11;i<=77;i++){
        await county(i) //iterates through all counties in Florida
    }  
}
main()
