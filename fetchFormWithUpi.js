var request = require("request"),
  cheerio = require('cheerio');

exports.fetchLearnerForm = function (fetchformData, data, reqCookie) {

  // Setting URL and headers for request
  var options = {
    method: 'POST',
    url: 'https://nemis.education.go.ke/Learner/LearnerRegistration.aspx',
    headers: {
      'postman-token': '1db9bb1a-c821-6384-edc1-be6b74afd329',
      'cache-control': 'no-cache',
      cookie: reqCookie,
      'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
    },
    formData: {
      __EVENTTARGET: 'ctl00$ContentPlaceHolder1$txtUPI',
      __VIEWSTATE: '/wEPDwULLTE1NjUzODM5ODgPZBYCZg9kFgYCBA8PFgIeBFRleHQFFUZyaWRheSwgTWFyY2ggMiwgMjAxOGRkAgYPDxYCHwAFIVdlbGNvbWU6IDxzdHJvbmc+VElHT05JIDwvc3Ryb25nPmRkAggPFgIeB2VuY3R5cGUFE211bHRpcGFydC9mb3JtLWRhdGEWBAIDDxQrAA0PFgIeC18hRGF0YUJvdW5kZ2RkZGRkZGRkZBAWABYAZBAWABYAZGQUKwAHBRcwOjAsMDoxLDA6MiwwOjMsMDo0LDA6NRQrAAIWDh8ABQRIT01FHgVWYWx1ZQUESE9NRR4LTmF2aWdhdGVVcmwFDS9kZWZhdWx0LmFzcHgeB0VuYWJsZWRnHgpTZWxlY3RhYmxlZx4IRGF0YVBhdGgFDS9kZWZhdWx0LmFzcHgeCURhdGFCb3VuZGdkFCsAAhYMHwAFDElOU1RJVFVUSU9OUx8DBQxJTlNUSVRVVElPTlMfBWcfBmgfBwUkNjIzNjNjYzYtNDk2MS00M2Y5LWEzZjUtN2Q0YTRiNDkyNGEyHwhnFCsABAULMDowLDA6MSwwOjIUKwACFg4fAAUOTXkgSW5zdGl0dXRpb24fAwUOTXkgSW5zdGl0dXRpb24fBAUdL0luc3RpdHV0aW9uL0luc3RpdHV0aW9uLmFzcHgfBWcfBmcfBwUdL2luc3RpdHV0aW9uL2luc3RpdHV0aW9uLmFzcHgfCGdkFCsAAhYOHwAFEkxlYXJuaW5nIE1hdGVyaWFscx8DBRJMZWFybmluZyBNYXRlcmlhbHMfBAUjL0luc3RpdHV0aW9uL0xlYXJuaW5nbWF0ZXJpYWxzLmFzcHgfBWcfBmcfBwUjL2luc3RpdHV0aW9uL2xlYXJuaW5nbWF0ZXJpYWxzLmFzcHgfCGdkFCsAAhYOHwAFB1V0aWxpdHkfAwUHVXRpbGl0eR8EBRkvSW5zdGl0dXRpb24vVXRpbGl0eS5hc3B4HwVnHwZnHwcFGS9pbnN0aXR1dGlvbi91dGlsaXR5LmFzcHgfCGdkFCsAAhYMHwAFB0xFQVJORVIfAwUHTEVBUk5FUh8FZx8GaB8HBSQyZWI2NmM4OS01YTZiLTRmOTUtYmJkMy00OTc0ZDg1ZGE1YWMfCGcUKwAEBQswOjAsMDoxLDA6MhQrAAIWEB8ABQxSZWdpc3RyYXRpb24fAwUMUmVnaXN0cmF0aW9uHwQFIS9MZWFybmVyL0xlYXJuZXJSZWdpc3RyYXRpb24uYXNweB8FZx8GZx8HBSEvbGVhcm5lci9sZWFybmVycmVnaXN0cmF0aW9uLmFzcHgfCGceCFNlbGVjdGVkZ2QUKwACFg4fAAUNU3BlY2lhbCBOZWVkcx8DBQ1TcGVjaWFsIE5lZWRzHwQFGi9MZWFybmVyL1NwZWNpYWxOZWVkcy5hc3B4HwVnHwZnHwcFGi9sZWFybmVyL3NwZWNpYWxuZWVkcy5hc3B4HwhnZBQrAAIWDB8ABQhNb2JpbGl0eR8DBQhNb2JpbGl0eR8FZx8GaB8HBSQ0ODk3NmQxNy0yMTllLTRkMzQtOWRhNy00NDljY2ExODYwZmEfCGcUKwADBQcwOjAsMDoxFCsAAhYOHwAFD1JlbGVhc2UgTGVhcm5lch8DBQ9SZWxlYXNlIExlYXJuZXIfBAUcL0xlYXJuZXIvUmVsZWFzZUxlYXJuZXIuYXNweB8FZx8GZx8HBRwvbGVhcm5lci9yZWxlYXNlbGVhcm5lci5hc3B4HwhnZBQrAAIWDh8ABQ9SZWNlaXZlIExlYXJuZXIfAwUPUmVjZWl2ZSBMZWFybmVyHwQFHC9MZWFybmVyL1JlY2VpdmVMZWFybmVyLmFzcHgfBWcfBmcfBwUcL2xlYXJuZXIvcmVjZWl2ZWxlYXJuZXIuYXNweB8IZ2QUKwACFgwfAAUFU1RBRkYfAwUFU1RBRkYfBWcfBmgfBwUkYWVlNWY1OGEtZWNiMC00NzUxLWFmZjQtZTk1NzMyNGMzMzlkHwhnFCsABAULMDowLDA6MSwwOjIUKwACFg4fAAUMUmVnaXN0cmF0aW9uHwMFDFJlZ2lzdHJhdGlvbh8EBR0vU3RhZmYvU3RhZmZSZWdpc3RyYXRpb24uYXNweB8FZx8GZx8HBR0vc3RhZmYvc3RhZmZyZWdpc3RyYXRpb24uYXNweB8IZ2QUKwACFg4fAAUOUmVzcG9uc2liaWxpdHkfAwUOUmVzcG9uc2liaWxpdHkfBAUhL1N0YWZmL1RlYWNoZXJSZXNwb25zaWJpbGl0eS5hc3B4HwVnHwZnHwcFIS9zdGFmZi90ZWFjaGVycmVzcG9uc2liaWxpdHkuYXNweB8IZ2QUKwACFg4fAAUOUXVhbGlmaWNhdGlvbnMfAwUOUXVhbGlmaWNhdGlvbnMfBAUeL1N0YWZmL1N0YWZmUXVhbGlmaWNhdGlvbi5hc3B4HwVnHwZnHwcFHi9zdGFmZi9zdGFmZnF1YWxpZmljYXRpb24uYXNweB8IZ2QUKwACFg4fAAUPQ0hBTkdFIFBBU1NXT1JEHwMFD0NIQU5HRSBQQVNTV09SRB8EBRQvQ2hhbmdlUGFzc3dvcmQuYXNweB8FZx8GZx8HBRQvY2hhbmdlcGFzc3dvcmQuYXNweB8IZ2QUKwACFg4fAAUGTE9HT1VUHwMFBkxPR09VVB8EBQwvTG9nb3V0LmFzcHgfBWcfBmcfBwUML2xvZ291dC5hc3B4HwhnZGQCBQ9kFhACBA8PFgIeB1Zpc2libGVoZGQCGA8QDxYCHwJnZBAVHwkgLVNlbGVjdC0SQSBsZXZlbCAtIFllYXIgMTIgEUEgbGV2ZWwgLSBZZWFyIDEzCkJhYnkgQ2xhc3MKQ2xhc3MgMSAgIApDbGFzcyAyICAgCkNsYXNzIDMgICAKQ2xhc3MgNCAgIApDbGFzcyA1ICAgCkNsYXNzIDYgICAKQ2xhc3MgNyAgIApDbGFzcyA4ICAgI0Vhcmx5IFllYXJzIEZvdW5kYXRpb24gLSBQbGF5Z3JvdXAgI0Vhcmx5IFllYXJzIEZvdW5kYXRpb24gLSBSZWNlcHRpb24gCkZvcm0gMSAgICAKRm9ybSAyICAgIApGb3JtIDMgICAgCkZvcm0gNCAgICAKTnVyc2VyeSAgIApQcmUgVW5pdCAgEVByaW1hcnkgLSBZZWFyIDEgEVByaW1hcnkgLSBZZWFyIDIgEVByaW1hcnkgLSBZZWFyIDMgEVByaW1hcnkgLSBZZWFyIDQgEFByaW1hcnkgLSBZZWFyIDURUHJpbWFyeSAtIFllYXIgNiATU2Vjb25kYXJ5IC0gWWVhciAxMBNTZWNvbmRhcnkgLSBZZWFyIDExE1NlY29uZGFyeSAtIFllYXIgNyATU2Vjb25kYXJ5IC0gWWVhciA4IBJTZWNvbmRhcnkgLSBZZWFyIDkVHwkgLVNlbGVjdC0SQSBsZXZlbCAtIFllYXIgMTIgEUEgbGV2ZWwgLSBZZWFyIDEzCkJhYnkgQ2xhc3MKQ2xhc3MgMSAgIApDbGFzcyAyICAgCkNsYXNzIDMgICAKQ2xhc3MgNCAgIApDbGFzcyA1ICAgCkNsYXNzIDYgICAKQ2xhc3MgNyAgIApDbGFzcyA4ICAgI0Vhcmx5IFllYXJzIEZvdW5kYXRpb24gLSBQbGF5Z3JvdXAgI0Vhcmx5IFllYXJzIEZvdW5kYXRpb24gLSBSZWNlcHRpb24gCkZvcm0gMSAgICAKRm9ybSAyICAgIApGb3JtIDMgICAgCkZvcm0gNCAgICAKTnVyc2VyeSAgIApQcmUgVW5pdCAgEVByaW1hcnkgLSBZZWFyIDEgEVByaW1hcnkgLSBZZWFyIDIgEVByaW1hcnkgLSBZZWFyIDMgEVByaW1hcnkgLSBZZWFyIDQgEFByaW1hcnkgLSBZZWFyIDURUHJpbWFyeSAtIFllYXIgNiATU2Vjb25kYXJ5IC0gWWVhciAxMBNTZWNvbmRhcnkgLSBZZWFyIDExE1NlY29uZGFyeSAtIFllYXIgNyATU2Vjb25kYXJ5IC0gWWVhciA4IBJTZWNvbmRhcnkgLSBZZWFyIDkUKwMfZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2RkAiAPEA8WAh8CZ2QQFQcJIC1TZWxlY3QtBkFuZW1pYQZBc3RobWELQ29udnVsc2lvbnMIRGlhYmV0ZXMIRXBpbGVwc3kETm9uZRUHCSAtU2VsZWN0LQZBbmVtaWEGQXN0aG1hC0NvbnZ1bHNpb25zCERpYWJldGVzCEVwaWxlcHN5BE5vbmUUKwMHZ2dnZ2dnZxYBZmQCLw8QDxYEHgxBdXRvUG9zdEJhY2tnHwJnZBAVMAkgLVNlbGVjdC0HQmFyaW5nbwVCb21ldAdCdW5nb21hBUJ1c2lhD0VsZ2V5byBNYXJha3dldARFbWJ1B0dhcmlzc2EISG9tYSBCYXkGSXNpb2xvB0thamlhZG8IS2FrYW1lZ2EHS2VyaWNobwZLaWFtYnUGS2lsaWZpCUtpcmlueWFnYQVLaXNpaQZLaXN1bXUFS2l0dWkFS3dhbGUITGFpa2lwaWEETGFtdQhNYWNoYWtvcwdNYWt1ZW5pB01hbmRlcmEITWFyc2FiaXQETWVydQZNaWdvcmkHTW9tYmFzYQdNdXJhbmdhB05haXJvYmkGTmFrdXJ1BU5hbmRpBU5hcm9rB055YW1pcmEJTnlhbmRhcnVhBU55ZXJpB1NhbWJ1cnUFU2lheWEMVGFpdGEgVGF2ZXRhClRhbmEgUml2ZXINVGhhcmFrYS1OaXRoaQtUcmFucyBOem9pYQdUdXJrYW5hC1Vhc2luIEdpc2h1BlZpaGlnYQVXYWppcgpXZXN0IFBva290FTAJIC1TZWxlY3QtB0JhcmluZ28FQm9tZXQHQnVuZ29tYQVCdXNpYQ9FbGdleW8gTWFyYWt3ZXQERW1idQdHYXJpc3NhCEhvbWEgQmF5BklzaW9sbwdLYWppYWRvCEtha2FtZWdhB0tlcmljaG8GS2lhbWJ1BktpbGlmaQlLaXJpbnlhZ2EFS2lzaWkGS2lzdW11BUtpdHVpBUt3YWxlCExhaWtpcGlhBExhbXUITWFjaGFrb3MHTWFrdWVuaQdNYW5kZXJhCE1hcnNhYml0BE1lcnUGTWlnb3JpB01vbWJhc2EHTXVyYW5nYQdOYWlyb2JpBk5ha3VydQVOYW5kaQVOYXJvawdOeWFtaXJhCU55YW5kYXJ1YQVOeWVyaQdTYW1idXJ1BVNpYXlhDFRhaXRhIFRhdmV0YQpUYW5hIFJpdmVyDVRoYXJha2EtTml0aGkLVHJhbnMgTnpvaWEHVHVya2FuYQtVYXNpbiBHaXNodQZWaWhpZ2EFV2FqaXIKV2VzdCBQb2tvdBQrAzBnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2cWAWZkAjcPEA8WAh8CZ2RkFgBkAjkPDxYCHwpoZGQCPg8PZA8QFgFmFgEWAh4OUGFyYW1ldGVyVmFsdWVlFgFmZGQCjQEPDxYCHwAFBDhYOThkZBgCBR5fX0NvbnRyb2xzUmVxdWlyZVBvc3RCYWNrS2V5X18WBAUoY3RsMDAkQ29udGVudFBsYWNlSG9sZGVyMSRvcHRzcGVjaWFsbmVlZAUoY3RsMDAkQ29udGVudFBsYWNlSG9sZGVyMSRvcHRzcGVjaWFsbmVlZAUkY3RsMDAkQ29udGVudFBsYWNlSG9sZGVyMSRvcHRuZWVkc25vBSRjdGwwMCRDb250ZW50UGxhY2VIb2xkZXIxJG9wdG5lZWRzbm8FC2N0bDAwJE1lbnUxDw9kBRRMRUFSTkVSXFJlZ2lzdHJhdGlvbmQHP6dQlt52fhgasJej+r8AdG2Mvpj3YMIyWJ4ifmsT+A==',
      __EVENTVALIDATION: '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',
      ctl00$ContentPlaceHolder1$txtUPI: fetchformData.UPI
    }

  };

  // Return new promise
  return new Promise(function (resolve, reject) {

    // Do async job

    request(options, function (error, response, body) {

      var $ = cheerio.load(body);


       console.log("body for form fetch for " + data.firstname + " " + data.surname + body);

      if (error) {

        reject(error);
        data.fetchLearnerForm = "failed";

      } else {

        if ($('h2 > a').attr('href') === "/Login.aspx" || $('#form1').attr('action') === "./Login.aspx") {


          reject("savegeneratedUPI ----> cookie expired or incorrect");


        } else if ($('h1').html() == 'Object Moved') {

          reject("Problem with request URL, __VIEWSTATE, __EVENTVALIDATION or Missing paramenter");


        } else {


          var fullname = data.surname + "," + data.firstname + " " + data.othername,
            learnerFormDataresult = {};
          learnerFormDataresult.viewstate = $('#__VIEWSTATE').val();
          learnerFormDataresult.eventValidation = $('#__EVENTVALIDATION').val();
         // learnerFormDataresult.UPI = $('#ContentPlaceHolder1_txtUPI').val();


          console.log($('#ContentPlaceHolder1_txtNames').val().toUpperCase().trim().replace(/\s/g, '') + " ======= NAMES =========== " + fullname.toUpperCase().trim().replace(/\s/g, ''));


     
          //check if names are coreect

          if ($('#ContentPlaceHolder1_txtNames').val().toUpperCase().trim().replace(/\s/g, '') === fullname.toUpperCase().trim().replace(/\s/g, '')) {

                learnerFormDataresult.correctData = true;

                    //check if form is filled
                    if ($("#ContentPlaceHolder1_ddlcounty option:selected").val() == " -Select-" && $("#ContentPlaceHolder1_lblsubcounty option:selected").val() == " -Select-") {


                        learnerFormDataresult.isformFilled = false;


                    }else if( $("#ContentPlaceHolder1_ddlcounty option:selected").val() == " -Select-" && $("#ContentPlaceHolder1_lblsubcounty").val() == undefined){


                        learnerFormDataresult.isformFilled = false;

                    }else{

                      learnerFormDataresult.isformFilled = true;
                      
                    }


          } else {


            learnerFormDataresult.correctData = false;

            console.log("MISMATCH IN NAMES CHECK for :----------> " + data.firstname + "" + data.surname + " for ----> " + data.firstname + " " + data.surname);


          }

          resolve(learnerFormDataresult);
        }

      }

    })
  })

}