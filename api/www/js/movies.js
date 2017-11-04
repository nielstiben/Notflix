// API SETTINGS
const MAF_ADRESS = "http://www.myapifilms.com/";
const MAF_TOKEN = "d4d577c0-f06c-4b8a-a839-b9b954567328";

let token = "";
let showPersonal = false;
if (window.localStorage.getItem("authorization") !== null) {
    token = window.localStorage.getItem("authorization");
    showPersonal = true;
}

// Retrieve JSON
$.ajax({
        type: "GET",
        url: "/api/movies",
        headers: {'authorization': token},
        success: function (movieModel) {
            // Loop through each movie
            movieModel.movies.forEach(function (movie) {
                // Create a div
                let movieContainer = $("<div class='card'></div>");
                let movieContainerBox = $("<div class='card-block'></div>");

                // create thumbnail
                const movieThumbnail = $("<img src='../img/ic_loading.gif' class='thumb img-fluid rounded float-left'>");
                movieContainerBox.append(movieThumbnail);

                // Create detailsContainer
                const detailsContainer = $("<div class='info'>");

                // Create title
                const movieTitle = $("<h4 class=\"card-title\"></h4>").text(movie.title);
                detailsContainer.append(movieTitle);

                // Create subtitle
                const movieDirector = $("<h6 class='card-subtitle mb-2 text-muted'></h6>").text(movie.director);
                detailsContainer.append(movieDirector);

                // Create description
                const movieDescription = $("<p class='card-text'></p>").text(movie.description);
                detailsContainer.append(movieDescription);

                // Create global rating stars
                const globalRating = $("<div id='global" + movie.IMDB + "'>Global: </div>");
                globalRating.starRating({
                    initialRating: movie.rating.global,
                    strokeColor: '#894A00',
                    strokeWidth: 10,
                    starSize: 25,
                    readOnly: true,
                });
                detailsContainer.append(globalRating);        // Create rating stars

                // Show personal rating
                if (token !== 'null') {
                    // Create personal rating stars
                    const personalRating = $("<div id='" + movie.IMDB + "'>My rating: </div>");
                    let rating = 0;

                    const personalRatingDelete = $("<a id='delete" + movie.IMDB + "' href='#' style='float: right; padding: 0 10px 10px 0' ><img src='../img/delete.png' alt='delete rating'> </a>").css('display', 'none', 'important');
                    if (typeof movie.rating.personal !== 'undefined') {
                        // retrieve rating
                        rating = movie.rating.personal;
                        personalRatingDelete.css('display', 'inline', 'important');
                    }
                    personalRatingDelete.click(function () {
                        updateRatings(-1, movie.IMDB);
                    });
                    personalRating.starRating({
                        initialRating: rating,
                        strokeColor: '#000000',
                        hoverColor: '#91c1ff',
                        activeColor: '#8ab9ff',
                        starGradient: {
                            start: '#6aa7ff',
                            end: '#5fd9ff'
                        },
                        disableAfterRate: false,
                        strokeWidth: 10,
                        starSize: 25,
                        readOnly: false,
                        callback: function (currentRating, $el) {
                            updateRatings(currentRating, movie.IMDB);
                        },
                    });
                    detailsContainer.append(personalRating);
                    detailsContainer.append(personalRatingDelete);
                }

                movieContainerBox.append(detailsContainer);
                movieContainer.append(movieContainerBox);

                $("#movies").append(movieContainer);
            });
            getAllImages(movieModel.movies.length);
            // Get all generated thumbs and replace with an actual image
            const movieThumbs = $('.thumb ');

            function getAllImages(maxImages) {
                let imgCount = 0;

                function getNextImage() {
                    if (imgCount < maxImages) {
                        const IMDB = "tt" + movieModel.movies[imgCount].IMDB;
                        console.log(imgCount + " | LOADING THUMB OF: " + IMDB);
                        const requestURL = MAF_ADRESS + "imdb/idIMDB?idIMDB=" + IMDB + "&token=" + MAF_TOKEN;
                        console.log("Request URL created: " + requestURL);

                        try {
                            $.ajax({
                                method: 'GET',
                                url: requestURL,
                                async: true,
                                timeout: 60000,
                                cache: false,
                                dataType: 'jsonp',
                                jsonCallback: 'jsonp',
                                success: function (result) {
                                    console.log(result);
                                    // Poster key found
                                    if (result.data.movies[0].urlPoster) {
                                        posterURL = result.data.movies[0].urlPoster;
                                        console.log(imgCount + ": " + posterURL);
                                        movieThumbs[imgCount].src = posterURL; // Replace loading image with the poster that's found.
                                    }
                                    // Poster key not found
                                    else {
                                        movieThumbs[imgCount].src = "../img/unknown.png" // Replace loading image with blanko poster.
                                    }
                                    ++imgCount;
                                    getNextImage()
                                }
                            });
                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
                getNextImage();
            }



        }
    }
);

function updateRatings(newRating, imdb) {
    let method = "PUT";
    if (newRating === -1) method = "DELETE";

    // Delete rating

    // Adjust rating
    // Setup body
    const details = {
        'rate': newRating,
        'IMDB': imdb,
    };
    let formBody = [];
    for (const property in details) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");
    $.ajax({
        type: method,
        url: "/api/movie/rate",
        headers: {'authorization': token},
        data: formBody,
        success: function (result) {
            // Refresh global rating
            $.ajax({
                type: "GET",
                url: "/api/movie?IMDB=" + imdb,
                headers: {'authorization': token},
                success: function (result) {
                    $("#global" + imdb).starRating('setRating', result.rating.global);
                    if (method === "PUT") {
                        $("#delete" + imdb).css('display', 'inline', 'important');
                    }
                }
            })
        },
    });

    // Refresh personal rating bar
    if (method === "DELETE") {
        $("#" + imdb).starRating('setRating', 0);
        $("#delete" + imdb).css('display', 'none', 'important');


    }
}

