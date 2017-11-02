// Load settings
$.getScript("js/settings.js");

const moviesAPI = "/api/movies";

// Retrieve JSON
$.getJSON(moviesAPI, {
    format: "json"
}).done(function (movieModel) {

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

        // Create rating starrs
        const ratingStars = $("<div class=\"my-rating\"></div>");
        ratingStars.starRating({
            initialRating: movie.rating.global,
            strokeColor: '#894A00',
            strokeWidth: 10,
            starSize: 25,
            readOnly: true,
        });
        detailsContainer.append(ratingStars);

        movieContainerBox.append(detailsContainer);
        movieContainer.append(movieContainerBox);

        $("#movies").append(movieContainer);
    });

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

    getAllImages(movieModel.movies.length);
});

// Example of getting the Image out of the JSON Object
// console.log(result.data.movies[0].urlPoster);