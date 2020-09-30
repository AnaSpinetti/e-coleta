const express = require("express")
const server = express()

//Pegar o banco de dados que exportamos no arquivo db.js
const db = require("./database/db.js")

//configurar pasta publica como se fosse raiz
server.use(express.static("public"))

//habilitar o uso do req.body na aplicação usando o método post
server.use(express.urlencoded({ extended: true }))

//utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server, 
    noCache: true
})

//Configurar caminho da aplicação
//Página inicial
server.get("/", (req, res ) => {
    //res.sendFile(__dirname + "/views/index.html") - Formato sem utilizar o nunjucks e renderizar as páginas
    return res.render("index.html")
})

server.get("/cadastro", (req, res ) => {
    return res.render("cadastro.html")

    //req.query: Query Strings da URL se usarmos o método get
})

server.post("/savepoint", (req, res ) => {
    //console.log(req.body) - Visualizar dados cadastrados via formulário

    //Inserir dados no BD
    const query = `
        INSERT INTO places (
            image,
            name, 
            address, 
            address2, 
            state, 
            city, 
            items
        ) VALUES (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
        )
    `
    
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err){
        if(err) {
            return res.render("error.html")
        }

        return res.render("cadastro.html", {saved: true})
    }

    //cadastrar os dados na tabela
    db.run(query, values, afterInsertData) 

})

    server.get("/search", (req, res ) => {
    const search = req.query.search

    if (search == ""){    

        return res.render("search-results.html", { total: 0 })

    }
    //Pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
        if(err) {
            return console.log(err)
        }

        //total de items cadastrados
        const total = rows.length
        
        //Mostrar a página HTML com os dados do BD
        return res.render("search-results.html", { places: rows, total })
    })

})
//Ligar o servidor
server.listen(3000)