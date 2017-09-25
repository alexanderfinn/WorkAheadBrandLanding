// Google Spreadsheet script URL
var url = "https://script.google.com/macros/s/AKfycbyoj9o7HZGlyqjU9fj-fF_90jbU_XJDVcd6WUw8XZ6cpOxjKq03/exec";

var supplierFormSubmit = function(event) {
  try {
    var supplierWebSite = $('#supplier-web-site-input').val(); 
    var params = getQueryParams(document.location.search);
    var email = '';
    if ('email' in params) {
      email = params.email;
      addToSpreadsheet(email, supplierWebSite); 
    } else {
      askForEmail(supplierWebSite);
    }

  } catch(e) {
    console.log(e);
  } finally {
    event.preventDefault();
  }
}

var askForEmail = function(supplierWebSite) {
  $('#supplier-form-container').addClass('hidden');
  $('#contact-form-container').removeClass('hidden');
  $('#contact-form').submit(function(event) {
    try {
      var email = $("#contact-email-input").val();
      addToSpreadsheet(email, supplierWebSite); 
    } catch(e) {
      console.log(e);
    } finally {
      event.preventDefault();
    }
  });
}

var addToSpreadsheet = function(email, supplier) {
    var date = new Date().toISOString();
    $.post(
      url,
      {
        'Email': email,
        'Supplier': supplier,
        'Date': date
      }
    ).done(function() {
      alert("Supplier has been recorded");
    });
}

$(document).ready(function() {
  $('#supplier-form').submit(supplierFormSubmit);
});

// Utility functions
function getQueryParams(qs) {
  qs = qs.split('+').join(' ');

  var params = {},
    tokens,
    re = /[?&]?([^=]+)=([^&]*)/g;

  while (tokens = re.exec(qs)) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }

  return params;
}
