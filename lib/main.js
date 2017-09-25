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
  $('#contact-email-input').focus();
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

var addToSpreadsheet = function(email, supplier, importance=0) {
    var date = new Date().toISOString();
    $.post(
      url,
      {
        'Email': email,
        'Supplier': supplier,
        'Date': date,
        'Importance': importance
      }
    ).done(function() {
      showMessage('Supplier has been recorded');
      if (importance == 0) {
        showAdditionalSuppliersContainer(email);
      }
    });
}

var showAdditionalSuppliersContainer = function(email) {
  $('#supplier-form-container').addClass('hidden');
  $('#contact-form-container').addClass('hidden');
  $('#additional-suppliers-container').removeClass('hidden');
  $("#additional-supplier-input1").focus();
  $('#additional-suppliers-form').submit(function(event) {
    try {
      for (var i=1; i<6; i++) {
        var sw = $("#additional-supplier-input" + i).val();
        if (sw == undefined || sw == '') {
          continue;
        }
        var importance = $("input[name=importance" + i + "]:checked").val();
        addToSpreadsheet(email, sw, importance)
      }
      $('#additional-suppliers-container').addClass('hidden');
      $('#thank-you-container').removeClass('hidden');

    } catch(e) {
      console.log(e);
    } finally {
      event.preventDefault();
    }

  });

}

var showMessage = function(message) {
  $('#messages-container').html(message);
}

$(document).ready(function() {
  $('#supplier-form').submit(supplierFormSubmit);
  $('#supplier-web-site-input').focus();
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
