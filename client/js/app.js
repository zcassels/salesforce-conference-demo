function displayLoginInfo() {
    force.getLoginInfo(function(data) {
        $("#signin").hide();
        $("#welcome").show();

        var welcomeform = "<div id=\"welcomeWrapper\"><h2>Welcome " + data.display_name + "</h2>";
        welcomeform += "<hr/>";
        welcomeform += "<h3>User Name: " + data.username + "</h3>";
        welcomeform += "<h3>Email: " + data.email + "</h3>";
        welcomeform += "<button id=\"logout\" onClick=\"logout()\">Sign out</button></div>"

        $('#welcome').append(welcomeform);
    }, 
    function(error) {
        alert(error)
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
