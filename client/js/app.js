function displayLoginInfo() {
    force.getLoginInfo(function(data) {
        console.log(data);
        $("#signin").hide();
        $("#welcome").show();

        var welcomeform = "<div id=\"welcomeWrapper\"><h2 class=\"page-header\">Welcome " + data.display_name + "</h2>";
        welcomeform += "<h4>User Name: " + data.username + "</h3>";
        welcomeform += "<h4>Email: " + data.email + "</h3>";
        welcomeform += "<h4>User Id: " + data.user_id + "</h3>";
        welcomeform += "<h4>Org Id: " + data.organization_id + "</h3>";
        welcomeform += "<button type=\"button\" class=\"btn btn-default\" id=\"logout\" onClick=\"logout()\">Sign out</button></div>"

        $('#welcome').append(welcomeform);
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
    $("#welcomeWrapper").remove();
    $("#welcome").hide();
    $("#signin_btn").prop("disabled", false);
}

router.addRoute('', displayLoginInfo)
