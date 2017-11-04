$(document).ready(function () {
// Check if user has a (valid) token. The login form will dissapear when the token is valid.
    // Check localstorage for token
    if (window.localStorage.getItem("authorization") !== null) {
        const token = window.localStorage.getItem("authorization");

        // Retrieve movies
        $.ajax({
            type: "GET",
            url: "/api/users",
            headers: {'authorization': token},

            success: function (result) {
                result.users.forEach(function (user) {
                    // Create a div
                    let userContainer = $("<div class='card' style='padding: 15px;'></div>");

                    // Check if middlename
                    let middleName = "";
                        if( typeof user.middlename !==  "undefined"){
                            middleName = user.middlename;
                        }

                    // Create fullname
                    const userFullname = $("<h4 class='card-title '></h4>").text(user.firstname + " " + middleName + " " + user.lastname);
                    userContainer.append(userFullname);

                    // Create username
                    const userUsername = $("<h6 class='card-subtitle text-muted'></h6>").text(user.username);
                    userContainer.append(userUsername);


                    $("#message-box").css('display', 'none', 'important');
                    $("#users").append(userContainer);

                })

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                const errorObj = JSON.parse(XMLHttpRequest.responseText);
                $("#message-box").html("<div class='alert alert-warning'> <strong>Oops! </strong>" + errorObj.error + " </div>").css('display', 'inline', 'important');
            },
            beforeSend: function () {
                $("#message-box").html("<img style='height: 30px; margin-right: 5px;' src='img/ic_loading_small.gif'/>").css('display', 'inline', 'important');
            }
        });
    }
    // User has no token
    else{
        $("#message-box").html("<div class='alert alert-warning'> <strong>Oops! </strong>You must be logged in, in order to see this page </div>").css('display', 'inline', 'important');
    }
});