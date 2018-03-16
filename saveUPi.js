var request = require("request"),
    cheerio = require('cheerio');

exports.saveGeneratedUpi = function (result, data, reqCookie) {

    // Setting URL and headers for request
    var options = {
        method: 'POST',
        url: 'https://nemis.education.go.ke/Institution/people.aspx',
        headers:
            {
                'postman-token': 'd93d3a87-0564-c2fc-4abb-c19346ce4638',
                'cache-control': 'no-cache',
                cookie: reqCookie,
                'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
            },

        formData:
            {
                __VIEWSTATE: result.viewstate,
                __EVENTVALIDATION: result.eventValidation,
                'ctl00$ContentPlaceHolder1$UPI': result.UPI,
                'ctl00$ContentPlaceHolder1$Surname': data.surname,
                'ctl00$ContentPlaceHolder1$FirstName': data.firstname,
                'ctl00$ContentPlaceHolder1$OtherNames': data.othername,
                'ctl00$ContentPlaceHolder1$Birth_Cert_No': data.birthNo,
                'ctl00$ContentPlaceHolder1$ID_No': 'NONE',
                'ctl00$ContentPlaceHolder1$DOB$ctl00': data.dob,
                'ctl00$ContentPlaceHolder1$Gender': data.gender,
                'ctl00$ContentPlaceHolder1$Nationality': '1',
                'ctl00$ContentPlaceHolder1$Entry_AS': '2',
                'ctl00$ContentPlaceHolder1$btnUsers': 'Click here to Save Data'
            }
    };


    // Return new promise 
    return new Promise(function (resolve, reject) {

        // Do async job


        request(options, function (error, response, body) {

            var $ = cheerio.load(body);

            if (error) {

                reject(error);

            } else {

                if ($('h2 > a').attr('href') === "/Login.aspx" || $('#form1').attr('action') === "./Login.aspx") {


                    reject("savegeneratedUPI ----> cookie expired or incorrect");

                } else if ($('h1').html() == 'Object Moved') {

                    reject("Problem with request URL, __VIEWSTATE, __EVENTVALIDATION or Missing paramenter");

                } else {

                    var saveGeneratedUpiresult = {};
                      var  succesSavedUpiPatt = /has been a signed to/,
                        failedSaveUpiPatt = /Violation of PRIMARY KEY constraint 'PK_PERSONS'/;


                    // UPI save succesful

                    if (succesSavedUpiPatt.test($('#ContentPlaceHolder1_instmessage > div').text())) {

                        saveGeneratedUpiresult.birthCertNo = data.birthNo;
                        saveGeneratedUpiresult.saved = true;
                        saveGeneratedUpiresult.UPI = result.UPI;

                    }

                    else {


                        //failed save : upi already assigned

                        if (failedSaveUpiPatt.test($('#ContentPlaceHolder1_peoplemessage').text())) {


                            saveGeneratedUpiresult.birthCertNo = data.birthNo;
                            saveGeneratedUpiresult.saved = false;
                            saveGeneratedUpiresult.UPI = '';

                                  

                        } else {

                            


                            console.log('check savegeneratedUPI request parameters somethings is wrong');


                        }


                    }

                    resolve(saveGeneratedUpiresult);
                }

            }

        })
    })

}
