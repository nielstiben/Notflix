$(document).ready(function () {
    $("#registerButton").click(function () {
        const firstname = $("#first-name").val();
        const middlename = $("#middle-name").val();
        const lastname = $("#last-name").val();
        const newusername = $("#new-username").val();
        const newpassword = $("#new-password").val();

        // Setup body
        const details = {
            'firstname': firstname,
            'middlename': middlename,
            'lastname': lastname,
            'username': newusername,
            'password': newpassword,
        };
        let formBody = [];
        for (const property in details) {
            const encodedKey = encodeURIComponent(property);
            const encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        // Login
        $.ajax({
            type: "POST",
            url: "/api/auth/register",
            data: formBody,
            success: function (result) {
                $("#message-box").html("<div class='alert alert-success'> <strong>Success!</strong> Your account is successfully registered. </div>").css('display', 'inline', 'important');


            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                const errorObj = JSON.parse(XMLHttpRequest.responseText);
                $("#message-box").html("<div class='alert alert-warning'> <strong>Oops! </strong>" + errorObj.error + " </div>").css('display', 'inline', 'important');
            },
            beforeSend: function () {
                $("#message-box").html("<img style='height: 30px; margin-right: 5px;' src='img/ic_loading_small.gif'/>").css('display', 'inline', 'important');
            }
        });

        return false;
    });
// Check if user has a (valid) token. The login form will dissapear when the token is valid.
    // Check localstorage for token
    if (window.localStorage.getItem("authorization") !== null) {
        const token = window.localStorage.getItem("authorization");

        // Validate token by using an ajax call
        $.ajax({
            type: "GET",
            url: "/api/auth/validate",
            headers: {'authorization': token},
            // Token is valid
            success: function (result) {
                // Hide messagebox and loginform
                $("#registerForm").css('display', 'none', 'important');
                $("#message-box").html("<div class='alert alert-danger'> <strong>Error!</strong> You cannot register a new user while logged in. </div>").css('display', 'inline', 'important');

            },
        });
    }

});