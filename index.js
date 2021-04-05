const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const mysql = require('mysql')

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pokemon',
})

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/api/get', (req, res) => {
    const sqlSelect = "SELECT * FROM pokemon"
    db.query(sqlSelect, (err, result) => {
        res.send(result)
    })
})

app.get('/api/get/:name', (req, res) => {
    const name = req.params.name
    const sqlSelect = "SELECT * FROM pokemon WHERE name = ?"

    db.query(sqlSelect, name, (err, result) => {
        res.send(result)
    })
})

app.get('/api/getjoin', (req, res) => {
    const sqlSelect = "SELECT pokemon.name AS name, pokemon.qty AS qty, my_pokemon_list.nickname AS nickname, my_pokemon_list.status AS status FROM pokemon JOIN my_pokemon_list ON my_pokemon_list.id_pokemon = pokemon.id"
    db.query(sqlSelect, (err, result) => {
        res.send(result)
    })
})

app.post("/api/insert", (req, res) => {
    const nickname = req.body.nickname
    const id_pokemon = req.body.id_pokemon
    const name = req.body.name
    const qty = req.body.qty

    const sqlSelect = "SELECT * FROM my_pokemon_list WHERE nickname = ?"
    db.query(sqlSelect, nickname, (err, result) => {
        if (err) {
            res.send({err: err})
        }

        if (result.length > 0) {
            res.send({message: "Nickname already exist"})
        } else {
            const sqlInsert = "INSERT INTO my_pokemon_list (nickname, id_pokemon, status) VALUES (?,?,'active')"
            db.query(sqlInsert, [nickname, id_pokemon], (err, result) => {
                console.log(err)
            })

            const sqlUpdate = "UPDATE pokemon SET qty = ? WHERE name = ?"
            db.query(sqlUpdate, [qty, name], (err, result) => {
                if (err) console.log(err)
            })

            res.send({message: "Pokemon has been added to your list"})
        }
    })
    
})

app.delete('/api/delete/:nickname', (req, res) => {
    const nickname = req.params.nickname

    const sqlDelete = "DELETE FROM my_pokemon_list WHERE nickname = ?"
    db.query(sqlDelete, nickname, (err, result) => {
        if (err) console.log(err)
    })
})

app.put("/api/update", (req, res) => {
    const nickname = req.body.nickname
    const name = req.body.name
    const qty = (req.body.qty) - 1

    const sqlUpdate = "UPDATE pokemon SET qty = ? WHERE name = ?"
    db.query(sqlUpdate, [qty, name], (err, result) => {
        if (err) console.log(err)
    })

    const sqlUpdate2 = "UPDATE my_pokemon_list SET status = 'disable' WHERE nickname = ?"
    db.query(sqlUpdate2, nickname, (err, result) => {
        if (err) console.log(err)
    })
})



app.listen(3001, () => {
    console.log("running on port 3001")
})
