$(document).ready(function () {
    // By default, there are no messages and the user is not logged in
    $("#msgBox").css('display', 'none', 'important');
    $("#logoutForm").css('display', 'none', 'important');
    $("#nav_users").css('display', 'none', 'important');

    // Check if user send a (valid) token
    validateToken();

    $("#loginButton").click(function () {
        const username = $("#username").val();
        const password = $("#password").val();

        // Setup body
        const details = {
            'username': username,
            'password': password,
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
            url: "/api/auth/login",
            data: formBody,
            success: function (result) {

                // Token received
                if (result.token) {
                    // Store token to local storage
                    const token = "JMT " + result.token;
                    window.localStorage.setItem("authorization", token);
                    validateToken();
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                const errorObj = JSON.parse(XMLHttpRequest.responseText);
                $("#msgBox").html("<p class='mb-0 text-white'>" + errorObj.error + "&emsp;</p>").css('display', 'inline', 'important');
            },
            beforeSend: function () {
                $("#msgBox").html("<img style='height: 30px; margin-right: 5px;' src='img/ic_loading_small.gif'/>").css('display', 'inline', 'important');
            }
        });

        return false;
    });

    // Check if user has a (valid) token. The login form will dissapear when the token is valid.
    function validateToken() {
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
                    $("#msgBox").html("<h2 class='navbar-brand mb-0 text-white'>" + result.username + "</h2>").css('display', 'inline', 'important');
                    $("#loginForm").css('display', 'none', 'important');
                    $("#logoutForm").css('display', 'inline', 'important');
                    $("#nav_users").css('display', 'inline', 'important');


                    // Setup logout button
                    $("#logoutButton").click(function () {
                        window.localStorage.setItem("authorization", null);
                    });
                },
            });
        }
    }
});