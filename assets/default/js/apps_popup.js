$(document).ready(function() {
    if(localStorage.getItem('popState') != 'shown'){
        $("#once-popup").fadeIn();
        localStorage.setItem('popState','shown')
    }
    

    $('#popup-close').click(function(e) // You are clicking the close button
    {
    $('#once-popup').fadeOut(); // Now the pop up is hiden.
    });
    $('#once-popup').click(function(e) 
    {
    $('#once-popup').fadeOut(); 
    });
});