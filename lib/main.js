var supplierFormSubmit = function(event) {
  try {
    var supplierWebSite = $('#supplier-web-site-input').val(); 
    var params = getQueryParams(document.location.search);
    var email = '';
    if ('email' in params) {
      email = params.email;
    }
    
    var date = new Date().toISOString();
    var url = "https://script.google.com/macros/s/AKfycbyoj9o7HZGlyqjU9fj-fF_90jbU_XJDVcd6WUw8XZ6cpOxjKq03/exec";
    $.post(
      url,
      {
        'Email': email,
        'Supplier': supplierWebSite,
        'Date': date
      }
    ).done(function() {
      alert("Supplier has been recorded");
    });
    alert("Supplier web site: " + supplierWebSite);
  } catch(e) {
    console.log(e);
  } finally {
    event.preventDefault();
  }
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
