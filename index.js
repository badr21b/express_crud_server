//import {serviceRequest} from "serviceRquest";

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "CRUDDataBase"
});

app.use(cors());
app.use(express.json());

app.post('/api/insert', (req, res) =>{
    const movieName = req.body.movieName;
    const movieReview = req.body.movieReview;

    const sqlInsert = "INSERT INTO movie_reviews (movieName,  movieReview) VALUES (?, ?)"
    db.query(sqlInsert,
        [movieName, movieReview], (err, result) => {

            console.log(err);
            console.log(res);

        if (err) {
            console.log(err);
        } else {
           res.send(result);
        }
    })

});

app.get('/:route', (req, res) => {
    let parameters = generateRouteForRequest(req.params.route);
    db.query("SELECT * FROM " + parameters.table, (err, result) => {
        if (err){
            console.log(err)
        } else {
            res.send(result);
        }
    });
});


function generateRouteForRequest(route) {
    let apiRoute = ''
    let apiTable = ''

    switch (route) {
        case "posts":
            apiRoute = route;
            apiTable = 'posts_table'
            break;
        case "movies":
            apiRoute = route;
            apiTable = 'movie_reviews'
            break;

        default:
            break;
    }
    return {
        api: apiRoute,
        table: apiTable
    }
}

app.delete('/api/delete/:movieName', (req, res) => {
    let parameters = generateRouteForRequest(req.params.route);
    const name = req.params.movieName;
    const sqlDelete = "DELETE FROM movie_reviews WHERE movieName = ?"
    db.query(sqlDelete, name, (err, result) => {
        if (err){
            console.log(err)
        } else {
            res.send(result);
        }
    });
});




app.put('/api/update', (req, res) => {
    const movieName = req.body.movieName;
    const movieReview = req.body.movieReview;
    const sqlUpdate = "UPDATE movie_reviews SET movieReview = ? WHERE movieName = ?";
    // db.query(sqlUpdate, [movieReview,movieName], (err, result) => {
    //     if (err){
    //         console.log(err)
    //     } else {
    //         res.send(result);
    //     }
    // });

    db.query(sqlUpdate,
        [movieReview, movieName], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        })
});


app.listen(3001, () => {
    console.log("running on port 3001");
})
