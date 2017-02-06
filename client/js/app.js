function displayLoginInfo() {
    force.getLoginInfo(function(data) {

        $("#configsList").html("");

        $("#welcome").show();
        $("#configs").show();

        $("#displayName").text(data.display_name);
        $("#username").text(data.username);
        $("#email").text(data.email);
        $("#userId").text(data.user_id);
        $("#orgId").text(data.organization_id);

        console.log(data);
        $("#signin").hide();

        $.ajax({
            url: '/api/configs', 
            headers: {
                "Authorization": "Bearer " + force.getSessionToken()
            }
        }).done(function(result) {
            result.forEach(function(val) {
                $("#configsList").append("<li class=\"list-group-item\">" + val.value + "</li>");
            });
        });
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

function addConfig() {
    var configInput = $("#configInput").val();
    $("#configInput").val('');
    $("#configsList").append("<li class=\"list-group-item\">" + configInput + "</li>");

    var request = $.ajax({
        url: "/api/configs",
        method: "POST",
        data: JSON.stringify({ value : configInput }),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + force.getSessionToken()
        },
        success: function (){
            console.log("POST /api/configs done.")
        }
    });
}

function logout() {
    console.log("logging out");
    force.discardToken();

    $("#signin").show();
    $("#configs").hide();
    $("#welcome").hide();
    $("#signin_btn").prop("disabled", false);
}

router.addRoute('', displayLoginInfo);
router.addRoute('#', displayLoginInfo);

$(function() {
    $("#welcome").hide();
    $("#configs").hide();
});