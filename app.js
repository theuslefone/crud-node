const express = require('express');
const { randomUUID } = require("crypto");
const fs = require("fs");

const app = express();

app.use(express.json());

// Constantes comuns 
const port = 4001;
let users = [];
fs.readFile("users.json", "utf-8", (err, data) =>{
    if(err) {
        console.log(err)
    } else {
        users = JSON.parse(data);
    }
})


// Adiciona usuário
app.post("/users", (req, res) =>{
    // Nome, idade e profissão

    const {nome, idade, profissao} = req.body;

    const user = {
        nome, 
        idade,
        profissao, 
        id : randomUUID()
    } ;

    users.push(user)
    writefile();

    return console.log(user);
});

// Retorna todos os usuários cadastrados
app.get("/users", (req, res) =>{
    return res.json(users)
});

// Retorna o usuário pesquisado pelo ID
app.get("/users/:id", (req, res) =>{
    const { id } = req.params;

    const user = users.find(user => user.id === id);
    return res.json(user);
});

// Altera dados do usuário pelo ID
app.put("/users/:id", (req, res) =>{
    const { id } = req.params;
    const {nome, idade, profissao} = req.body;

    const userIndex = users.findIndex(user => user.id == id);
    users[userIndex] = {
        ...users[userIndex],
        nome, 
        idade,
        profissao
    };

    writefile();
    return res.json({
        message: "Usuário alterado com sucesso!"
    })
})

// Deleta dados do usuário pelo ID
app.delete("/users/:id", (req, res) =>{
    const { id } = req.params; 

    const userIndex = users.findIndex(user => user.id == id);
    users.splice(userIndex, 1);

    writefile();
    return res.json({
        message: 'Usuário removido com sucesso'
    });
})


// Adiciona ou subscreve dentro do arquivo as atualizações dos dados
function writefile(){
    fs.writeFile("users.json", JSON.stringify(users), (err) =>{
        if(err){
            console.log(err)
        } else {
            console.log("Dados inseridos com sucesso!")
        }
    })
}

// Assim que rodar, exibe mensagem de boas vindas.
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));

