'use strict'
const openModal = function(){
    document.getElementById('modal').classList.remove('active')
}

const closeModal = function(){
    clearFields()
    document.getElementById('modal').classList.add('active')
}

const getLocalStorage = () =>
    JSON.parse(localStorage.getItem('dbClient')) ?? []


const setLocalStorage = (dbClient) =>
    localStorage.setItem("dbClient", JSON.stringify(dbClient))

// Crud //
// Delete //
const deleteClient = (index) =>{
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}

// Update //
const updateClient = (index, client)=> {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

// Crud Read //
    const readClient = () => getLocalStorage()

// Crud Create //
const creatClient = function(client){
    const dbClient = getLocalStorage()
    dbClient.push(client)
    setLocalStorage(dbClient)
    updateTable()
}

// Interação layout //

// Limpador de campos do modal //
const clearFields = ()=>{
    const fields = document.querySelectorAll('.modalField')
    fields.forEach(field => field.value = "")
}

const saveClient = ()=> {
    if (isValidFields()){
        const funcionario = {
            nome: document.getElementById('nomeFunc').value,
            email: document.getElementById('emailFunc').value,
            celular: document.getElementById('numberFunc').value,
            cidade: document.getElementById('cityFunc').value
        }
        const index = document.getElementById('nomeFunc').dataset.index
        if(index == 'new'){
        creatClient(funcionario)
        clearFields()
        updateTable()
        closeModal()
        }else{
            updateClient(index, funcionario)
            updateTable()
            closeModal()
        }
        
    }
}

const creatRow = (client, index)=>{
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="buttonGreen" id="edit-${index}">Editar</button>
            <button type="button" class="buttonRed" id="delete-${index}">Excluir</button>
        </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = ()=>{
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = ()=>{
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(creatRow)
}

const fillFields = (funcionario)=>{
    document.getElementById('nomeFunc').value = funcionario.nome
    document.getElementById('emailFunc').value = funcionario.email
    document.getElementById('numberFunc').value = funcionario.celular
    document.getElementById('cityFunc').value = funcionario.cidade
    document.getElementById('nomeFunc').dataset.index = funcionario.index
}

const editClient = (index)=>{
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()
}

const editDelete = (event)=>{
    if (event.target.type == 'button'){
        const [action, index] = event.target.id.split('-')
        
        if (action == 'edit'){
            editClient(index)
        }else{
            let funcionario = readClient()[index]
            const response = confirm(`Deseja realmente excluir o funcionário ${funcionario.nome}`)
            if (response){
                deleteClient(index)
                updateTable()
            }

        }
    }
    
}

updateTable()

// Verificação de campos //
const isValidFields = ()=>{
    return document.getElementById('modalForm').reportValidity()
}
// Eventos //
document.getElementById('cadastrarCliente').addEventListener('click', openModal)
document.getElementById('buttonClose').addEventListener('click', closeModal)
document.getElementById('salvar').addEventListener('click', saveClient)
document.getElementById('cancelar').addEventListener('click', closeModal)
document.querySelector('#tableClient>tbody').addEventListener('click', editDelete)
