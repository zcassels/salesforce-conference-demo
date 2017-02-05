function displayLoginInfo() {
    force.getLoginInfo(function(data) {

        $("#welcome").show();

        $("#displayName").text("Welcome " + data.display_name + "!");
        $("#userName").text("User Name: " + data.username);
        $("#email").text("Email: " + data.email);
        $("#userId").text("User Id: " + data.user_id);
        $("#orgId").text("Org Id: " + data.organization_id);

        console.log(data);
        $("#signin").hide();
    }, 
    function(error) {
        alert(error)
    });
}

function login() {
    $("#signin_btn").prop("disabled", true);
    
    // Get your Connected App id from the server
    $.ajax({url: '/appid'}).done(function(result) {

        // Initialize forcejs for that Connected app
        force.init({
            appId: result.appId
        });

        // Login
        force.login(router.start, function (error) {
            alert('Login failed: ' + error);
            $("#signin_btn").prop("disabled", false);
        });

        
    });
}

function logout() {
    console.log("logging out");
    force.discardToken();

    $("#signin").show();
    $("#welcome").hide();
    $("#signin_btn").prop("disabled", false);
}

router.addRoute('', displayLoginInfo)

$(function() {
    $("#welcome").hide();
});