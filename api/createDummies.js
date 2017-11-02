// /api/createDummies.js

// Tool in order to insert dummy content
console.log('   - inserting dummies...');

//  MOVIE ONE
const User = require('./models/UserModel');
const Movie = require('./models/MovieModel');
const mov1 = new Movie({
    IMDB: '0111161',
    title: 'The Shawshank Redemption',
    publicationDate: new Date(),
    length: 110,
    director: 'Frank Darabont',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    ratings: [
        {
            userId: "adsfadsfadsf",
            rate: 5
        },
        {
            userId: "adsfadsfadsf",
            rate: 4
        },
        {
            userId: "adsfadsfadsf",
            rate: 8
        }
        ]
});

mov1.save(function (err, data) {
    if (err) {
        console.error(err)
    } else {
        console.log('       - The Shawshank Redemption');
    }
});


//  MOVIE TWO
const mov2 = new Movie({
    IMDB: '1234567',
    title: 'MR. Bean',
    publicationDate: new Date(),
    length: 110,
    director: 'Bean',
    description: 'Blah blah.',
    ratings: [
        {
            userId: "adsfadsfadsf",
            rate: 2
        },
        {
            userId: "adsfadsfadsf",
            rate: 2
        },
        {
            userId: "adsfadsfadsf",
            rate: 1
        }
    ]
});

mov2.save(function (err, data) {
    if (err) {
        console.error(err)
    } else {
        console.log('       - Mr. Bean')
    }
});


//  MOVIE THREE
const mov3 = new Movie({
    IMDB: '0068646',
    title: 'The Godfather',
    publicationDate: new Date(),
    length: 160,
    director: 'Director: Francis Ford Coppola',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son. ',
    ratings: [
        {
            userId: "adsfadsfadsf",
            rate: 9
        },
        {
            userId: "adsfadsfadsf",
            rate: 8
        },
        {
            userId: "adsfadsfadsf",
            rate: 9
        }
    ]
});

mov3.save(function (err, data) {
    if (err) {
        console.error(err)
    } else {
        console.log('       - The Godfather')
    }
});



//  MOVIE THREE
const usr1 = new User({
    firstname: 'Niels',
    lastname: 'Tiben',
    username: 'ntiben',
    password: 'secret',
});

usr1.save(function (err, data) {
    if (err) {
        console.error(err)
    } else {
        console.log('       - The Godfather')
    }
});



