$(document).ready(function(){
    $("#msgBox").css('display', 'none', 'important');
    $("#submit").click(function(){
        const username=$("#name").val();
        const password=$("#word").val();
        const url = "/api/auth/login";

        $.ajax({
            type: "POST",
            url: "/api/auth/login",
            data: data,
            success: function(result){
                console.log(result);
            },
            beforeSend:function()
            {
                $("#msgBox").html("<img style='height: 30px; margin-right: 5px;' src='img/ic_loading_small.gif'/>").css('display', 'inline', 'important');
            }
        });

        $http({
            method: 'POST',
            url: url,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: {username: $scope.userName, password: $scope.password}
        }).success(function () {})
            .before;
        return false;
    });
});