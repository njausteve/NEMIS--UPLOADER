var request = require("request");
var cheerio = require('cheerio');
var csv = require("fast-csv");
var fs = require('fs');

var reqViewState = '/wEPDwULLTE1NjUzODM5ODgPZBYCZg9kFgYCBA8PFgIeBFRleHQFG1NhdHVyZGF5LCBGZWJydWFyeSAyNCwgMjAxOGRkAgYPDxYCHwAFIVdlbGNvbWU6IDxzdHJvbmc+VElHT05JIDwvc3Ryb25nPmRkAggPFgIeB2VuY3R5cGUFE211bHRpcGFydC9mb3JtLWRhdGEWBAIDDxQrAA0PFgIeC18hRGF0YUJvdW5kZ2RkZGRkZGRkZBAWABYAZBAWABYAZGQUKwAHBRcwOjAsMDoxLDA6MiwwOjMsMDo0LDA6NRQrAAIWDh8ABQRIT01FHgVWYWx1ZQUESE9NRR4LTmF2aWdhdGVVcmwFDS9kZWZhdWx0LmFzcHgeB0VuYWJsZWRnHgpTZWxlY3RhYmxlZx4IRGF0YVBhdGgFDS9kZWZhdWx0LmFzcHgeCURhdGFCb3VuZGdkFCsAAhYMHwAFDElOU1RJVFVUSU9OUx8DBQxJTlNUSVRVVElPTlMfBWcfBmgfBwUkOWFmNTk0ZjgtNzVjNi00MjY0LWI5YTAtNGU3ZDcxY2YyZTQ1HwhnFCsABAULMDowLDA6MSwwOjIUKwACFg4fAAUOTXkgSW5zdGl0dXRpb24fAwUOTXkgSW5zdGl0dXRpb24fBAUdL0luc3RpdHV0aW9uL0luc3RpdHV0aW9uLmFzcHgfBWcfBmcfBwUdL2luc3RpdHV0aW9uL2luc3RpdHV0aW9uLmFzcHgfCGdkFCsAAhYOHwAFEkxlYXJuaW5nIE1hdGVyaWFscx8DBRJMZWFybmluZyBNYXRlcmlhbHMfBAUjL0luc3RpdHV0aW9uL0xlYXJuaW5nbWF0ZXJpYWxzLmFzcHgfBWcfBmcfBwUjL2luc3RpdHV0aW9uL2xlYXJuaW5nbWF0ZXJpYWxzLmFzcHgfCGdkFCsAAhYOHwAFB1V0aWxpdHkfAwUHVXRpbGl0eR8EBRkvSW5zdGl0dXRpb24vVXRpbGl0eS5hc3B4HwVnHwZnHwcFGS9pbnN0aXR1dGlvbi91dGlsaXR5LmFzcHgfCGdkFCsAAhYMHwAFB0xFQVJORVIfAwUHTEVBUk5FUh8FZx8GaB8HBSQ1MTVkODExMS1kMTkzLTRjMzMtYWU2Mi1kZTEwYzBmYzkyYTAfCGcUKwAEBQswOjAsMDoxLDA6MhQrAAIWEB8ABQxSZWdpc3RyYXRpb24fAwUMUmVnaXN0cmF0aW9uHwQFIS9MZWFybmVyL0xlYXJuZXJSZWdpc3RyYXRpb24uYXNweB8FZx8GZx8HBSEvbGVhcm5lci9sZWFybmVycmVnaXN0cmF0aW9uLmFzcHgfCGceCFNlbGVjdGVkZ2QUKwACFg4fAAUNU3BlY2lhbCBOZWVkcx8DBQ1TcGVjaWFsIE5lZWRzHwQFGi9MZWFybmVyL1NwZWNpYWxOZWVkcy5hc3B4HwVnHwZnHwcFGi9sZWFybmVyL3NwZWNpYWxuZWVkcy5hc3B4HwhnZBQrAAIWDB8ABQhNb2JpbGl0eR8DBQhNb2JpbGl0eR8FZx8GaB8HBSRmMGI4MTg2Mi1hOGQ1LTQxMGEtYmYwYi0yZTliMWViZDU4YjEfCGcUKwADBQcwOjAsMDoxFCsAAhYOHwAFD1JlbGVhc2UgTGVhcm5lch8DBQ9SZWxlYXNlIExlYXJuZXIfBAUcL0xlYXJuZXIvUmVsZWFzZUxlYXJuZXIuYXNweB8FZx8GZx8HBRwvbGVhcm5lci9yZWxlYXNlbGVhcm5lci5hc3B4HwhnZBQrAAIWDh8ABQ9SZWNlaXZlIExlYXJuZXIfAwUPUmVjZWl2ZSBMZWFybmVyHwQFHC9MZWFybmVyL1JlY2VpdmVMZWFybmVyLmFzcHgfBWcfBmcfBwUcL2xlYXJuZXIvcmVjZWl2ZWxlYXJuZXIuYXNweB8IZ2QUKwACFgwfAAUFU1RBRkYfAwUFU1RBRkYfBWcfBmgfBwUkYjU5MjAzMzUtZTE1NC00YjZhLWI4ZTAtOTY0YzZhMGU2MWRjHwhnFCsABAULMDowLDA6MSwwOjIUKwACFg4fAAUMUmVnaXN0cmF0aW9uHwMFDFJlZ2lzdHJhdGlvbh8EBR0vU3RhZmYvU3RhZmZSZWdpc3RyYXRpb24uYXNweB8FZx8GZx8HBR0vc3RhZmYvc3RhZmZyZWdpc3RyYXRpb24uYXNweB8IZ2QUKwACFg4fAAUOUmVzcG9uc2liaWxpdHkfAwUOUmVzcG9uc2liaWxpdHkfBAUhL1N0YWZmL1RlYWNoZXJSZXNwb25zaWJpbGl0eS5hc3B4HwVnHwZnHwcFIS9zdGFmZi90ZWFjaGVycmVzcG9uc2liaWxpdHkuYXNweB8IZ2QUKwACFg4fAAUOUXVhbGlmaWNhdGlvbnMfAwUOUXVhbGlmaWNhdGlvbnMfBAUeL1N0YWZmL1N0YWZmUXVhbGlmaWNhdGlvbi5hc3B4HwVnHwZnHwcFHi9zdGFmZi9zdGFmZnF1YWxpZmljYXRpb24uYXNweB8IZ2QUKwACFg4fAAUPQ0hBTkdFIFBBU1NXT1JEHwMFD0NIQU5HRSBQQVNTV09SRB8EBRQvQ2hhbmdlUGFzc3dvcmQuYXNweB8FZx8GZx8HBRQvY2hhbmdlcGFzc3dvcmQuYXNweB8IZ2QUKwACFg4fAAUGTE9HT1VUHwMFBkxPR09VVB8EBQwvTG9nb3V0LmFzcHgfBWcfBmcfBwUML2xvZ291dC5hc3B4HwhnZGQCBQ9kFhwCBA8PFgIeB1Zpc2libGVoZGQCCA8PFgIfAAUGMTE4WEdXZGQCDA8PFgIfCmhkZAISDw8WAh8ABRRNQUlOQSxWSVZJQU4gV0FJUklNVWRkAhgPEA8WAh8CZ2QQFR8JIC1TZWxlY3QtEkEgbGV2ZWwgLSBZZWFyIDEyIBFBIGxldmVsIC0gWWVhciAxMwpCYWJ5IENsYXNzCkNsYXNzIDEgICAKQ2xhc3MgMiAgIApDbGFzcyAzICAgCkNsYXNzIDQgICAKQ2xhc3MgNSAgIApDbGFzcyA2ICAgCkNsYXNzIDcgICAKQ2xhc3MgOCAgICNFYXJseSBZZWFycyBGb3VuZGF0aW9uIC0gUGxheWdyb3VwICNFYXJseSBZZWFycyBGb3VuZGF0aW9uIC0gUmVjZXB0aW9uIApGb3JtIDEgICAgCkZvcm0gMiAgICAKRm9ybSAzICAgIApGb3JtIDQgICAgCk51cnNlcnkgICAKUHJlIFVuaXQgIBFQcmltYXJ5IC0gWWVhciAxIBFQcmltYXJ5IC0gWWVhciAyIBFQcmltYXJ5IC0gWWVhciAzIBFQcmltYXJ5IC0gWWVhciA0IBBQcmltYXJ5IC0gWWVhciA1EVByaW1hcnkgLSBZZWFyIDYgE1NlY29uZGFyeSAtIFllYXIgMTATU2Vjb25kYXJ5IC0gWWVhciAxMRNTZWNvbmRhcnkgLSBZZWFyIDcgE1NlY29uZGFyeSAtIFllYXIgOCASU2Vjb25kYXJ5IC0gWWVhciA5FR8JIC1TZWxlY3QtEkEgbGV2ZWwgLSBZZWFyIDEyIBFBIGxldmVsIC0gWWVhciAxMwpCYWJ5IENsYXNzCkNsYXNzIDEgICAKQ2xhc3MgMiAgIApDbGFzcyAzICAgCkNsYXNzIDQgICAKQ2xhc3MgNSAgIApDbGFzcyA2ICAgCkNsYXNzIDcgICAKQ2xhc3MgOCAgICNFYXJseSBZZWFycyBGb3VuZGF0aW9uIC0gUGxheWdyb3VwICNFYXJseSBZZWFycyBGb3VuZGF0aW9uIC0gUmVjZXB0aW9uIApGb3JtIDEgICAgCkZvcm0gMiAgICAKRm9ybSAzICAgIApGb3JtIDQgICAgCk51cnNlcnkgICAKUHJlIFVuaXQgIBFQcmltYXJ5IC0gWWVhciAxIBFQcmltYXJ5IC0gWWVhciAyIBFQcmltYXJ5IC0gWWVhciAzIBFQcmltYXJ5IC0gWWVhciA0IBBQcmltYXJ5IC0gWWVhciA1EVByaW1hcnkgLSBZZWFyIDYgE1NlY29uZGFyeSAtIFllYXIgMTATU2Vjb25kYXJ5IC0gWWVhciAxMRNTZWNvbmRhcnkgLSBZZWFyIDcgE1NlY29uZGFyeSAtIFllYXIgOCASU2Vjb25kYXJ5IC0gWWVhciA5FCsDH2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dkZAIgDxAPFgIfAmdkEBUHCSAtU2VsZWN0LQZBbmVtaWEGQXN0aG1hC0NvbnZ1bHNpb25zCERpYWJldGVzCEVwaWxlcHN5BE5vbmUVBwkgLVNlbGVjdC0GQW5lbWlhBkFzdGhtYQtDb252dWxzaW9ucwhEaWFiZXRlcwhFcGlsZXBzeQROb25lFCsDB2dnZ2dnZ2cWAWZkAi8PEA8WBB4MQXV0b1Bvc3RCYWNrZx8CZ2QQFTAJIC1TZWxlY3QtB0JhcmluZ28FQm9tZXQHQnVuZ29tYQVCdXNpYQ9FbGdleW8gTWFyYWt3ZXQERW1idQdHYXJpc3NhCEhvbWEgQmF5BklzaW9sbwdLYWppYWRvCEtha2FtZWdhB0tlcmljaG8GS2lhbWJ1BktpbGlmaQlLaXJpbnlhZ2EFS2lzaWkGS2lzdW11BUtpdHVpBUt3YWxlCExhaWtpcGlhBExhbXUITWFjaGFrb3MHTWFrdWVuaQdNYW5kZXJhCE1hcnNhYml0BE1lcnUGTWlnb3JpB01vbWJhc2EHTXVyYW5nYQdOYWlyb2JpBk5ha3VydQVOYW5kaQVOYXJvawdOeWFtaXJhCU55YW5kYXJ1YQVOeWVyaQdTYW1idXJ1BVNpYXlhDFRhaXRhIFRhdmV0YQpUYW5hIFJpdmVyDVRoYXJha2EtTml0aGkLVHJhbnMgTnpvaWEHVHVya2FuYQtVYXNpbiBHaXNodQZWaWhpZ2EFV2FqaXIKV2VzdCBQb2tvdBUwCSAtU2VsZWN0LQdCYXJpbmdvBUJvbWV0B0J1bmdvbWEFQnVzaWEPRWxnZXlvIE1hcmFrd2V0BEVtYnUHR2FyaXNzYQhIb21hIEJheQZJc2lvbG8HS2FqaWFkbwhLYWthbWVnYQdLZXJpY2hvBktpYW1idQZLaWxpZmkJS2lyaW55YWdhBUtpc2lpBktpc3VtdQVLaXR1aQVLd2FsZQhMYWlraXBpYQRMYW11CE1hY2hha29zB01ha3VlbmkHTWFuZGVyYQhNYXJzYWJpdARNZXJ1Bk1pZ29yaQdNb21iYXNhB011cmFuZ2EHTmFpcm9iaQZOYWt1cnUFTmFuZGkFTmFyb2sHTnlhbWlyYQlOeWFuZGFydWEFTnllcmkHU2FtYnVydQVTaWF5YQxUYWl0YSBUYXZldGEKVGFuYSBSaXZlcg1UaGFyYWthLU5pdGhpC1RyYW5zIE56b2lhB1R1cmthbmELVWFzaW4gR2lzaHUGVmloaWdhBVdhamlyCldlc3QgUG9rb3QUKwMwZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnFgFmZAI3DxAPFgQfAmcfCmdkZBYAZAI5Dw8WAh8KaGRkAj4PD2QPEBYBZhYBFgIeDlBhcmFtZXRlclZhbHVlZRYBZmRkAk8PDxYCHwBlZGQChwEPDxYCHwpnZGQCiwEPDxYCHwpoZGQCjQEPDxYCHwAFBDhYOThkZBgCBR5fX0NvbnRyb2xzUmVxdWlyZVBvc3RCYWNrS2V5X18WAwUoY3RsMDAkQ29udGVudFBsYWNlSG9sZGVyMSRvcHRzcGVjaWFsbmVlZAUoY3RsMDAkQ29udGVudFBsYWNlSG9sZGVyMSRvcHRzcGVjaWFsbmVlZAUkY3RsMDAkQ29udGVudFBsYWNlSG9sZGVyMSRvcHRuZWVkc25vBQtjdGwwMCRNZW51MQ8PZAUUTEVBUk5FUlxSZWdpc3RyYXRpb25kg/mcjiX4QWP+5wNHP3fWBawH5u0drQxBiEkRmdQAKU8=';
var reqEventValidation = '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';
var currentCookie = "ASP.NET_SessionId=raxxamdcxeu40dhbmhmbjkpw";
var countyName = '';
var resViewState, resEventValidation;
var counties = [];
var sourceDataPath = 'county.csv';
var destDataPath = 'countyandsub.csv';
var rs = fs.createReadStream(sourceDataPath);
var ws = fs.createWriteStream(destDataPath);
var csvStream = csv.createWriteStream({
  headers: true
});
csvStream.pipe(ws);

csv
  .fromStream(rs, {
    headers: true
  })
  .on("data", function(data) {


    var countyStreamValue = data.county.trim();

    var subcountiesPromise = new getSubcounties(countyStreamValue)




      .then(function(result) {

        console.log(countyStreamValue + " has this subcounties ");
        console.log(result);
        console.log('\n');

        data.subcounty = result;

        //csvStream.pipe(ws);
        //   csvStream.write(data);


        csvStream.write(data);

      }, errHandler);








  })

  .on("end", function() {
    console.log("reading stream done");

  });



function getSubcounties(countyName) {
  // Setting URL and headers for request
  var options = {
    method: 'POST',
    url: 'http://nemis.education.go.ke/Learner/LearnerRegistration.aspx',
    headers: {
      'postman-token': 'fa6ba5d7-f069-b4a3-db11-39aa7676e45f',
      'cache-control': 'no-cache',
      cookie: currentCookie,
      'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
    },
    formData: {
      __EVENTTARGET: 'ctl00$ContentPlaceHolder1$ddlcounty:',
      __VIEWSTATE: reqViewState,
      __EVENTVALIDATION: reqEventValidation,
      'ctl00$ContentPlaceHolder1$ddlcounty': countyName
    }
  };

  // Return new promise
  return new Promise(function(resolve, reject) {
    // Do async job
    request(options, function(error, response, body) {
      var $ = cheerio.load(body);

      if ($('h2 > a').attr('href') === "/Login.aspx") {

        reject("cookie expired");
      }

      if (error) {
        reject(error);
      } else {


        var subcounties = [];

        $('#ContentPlaceHolder1_ddlsubcounty > option').each(function(index, option) {

          if (index !== 0) {
            subcounties.push($(this).val());
          }
        });

        resolve(subcounties);
      }

    })
  })

}


var errHandler = function(err) {
  console.log(err);
};