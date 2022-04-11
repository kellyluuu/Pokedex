// *********************************
//  Dependencies & variables 
// *********************************
const express = require('express')
require("dotenv").config()
const methodOverride = require('method-override')
const pokemons = require('./models/pokemon.js')
const morgan = require('morgan')
const PORT = process.env.PORT
const app = express()


// *********************************
// Middleware
// *********************************
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.use("/static", express.static("public"))
app.use(morgan("tiny"))

// *********************************
// Routes that Render Pages with EJS
// *********************************
app.get('/',(req,res)=>
res.send('<html><body><a href="/pokemon">Pokedex</a></body></html>'))

app.get('/pokemon',(req,res)=>{
    res.render('index.ejs',{allPokemons: pokemons})
})

app.get('/pokemon/new',(req,res)=>res.render('new.ejs'))


app.get('/pokemon/:id',(req,res)=>{
    const statsArr = Object.entries(pokemons[req.params.id].stats)
    res.render('show.ejs',{pokemon: pokemons[req.params.id], 
        statsArr: statsArr, index: req.params.id})
})

app.get('/pokemon/:id/edit', (req,res)=>{
    res.render('edit.ejs',{
        pokemon: pokemons[req.params.id],
        index: req.params.id
    })
})

app.post('/pokemon',(req,res)=>{
    req.body.stats = req.body.stats[0]
    req.body.misc = req.body.misc[0]
    let type = []
    type.push(req.body.type)
    req.body.type = type
    pokemons.push(req.body)
    res.redirect('/pokemon')
})

app.put("/pokemon/:id",(req,res)=>{
    req.body.stats = req.body.stats[0]
    req.body.misc = req.body.misc[0]
    let type = []
    type.push(req.body.type)
    req.body.type = type
    pokemons[req.params.id]=req.body
    res.redirect(`/pokemon/${req.params.id}`)
})

app.delete('/pokemon/:id',(req,res)=>{
    const index = req.params.id
    pokemons.splice(index,1)
    res.redirect('/pokemon')
})


// *********************************
// Server Listener
// *********************************
app.listen(PORT,()=>console.log(`POKEDEX RUNNING ON PORT ${PORT}`))
