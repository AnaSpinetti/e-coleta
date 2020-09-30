

    function preencherUf(){
        const ufSelect = document.querySelector("select[name=uf]")

        fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
            .then(res => res.json())
            /*Estrutura de repetição para preencher o campo UF com os 27 estados*/
            .then( states => {
                for (const state of states) {
                    ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
                }
            })
    }

    preencherUf()

    function getCities(event){

        const citySelect = document.querySelector("select[name=city]")
        const stateInput = document.querySelector("input[name=state")
        
        /*Pegando o Id do estado e inserindo no caminho da URL*/
        const ufValue = event.target.value
        
        const indexOfSelectedState = event.target.selectedIndex
        stateInput.value = event.target.options[indexOfSelectedState].text

        
        const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

        citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
        citySelect.disabled = true

        fetch(url)
        .then(res => res.json())
        .then( cities => {

            for (const city of cities) {
                citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
            }

            citySelect.disabled = false
        })
    }
    
    /*Chamando a função getCities após selecionaro estado*/
    document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)

    //items de coleta
    const itemsToCollect = document.querySelectorAll(".items-grid li")
    
    for (const item of itemsToCollect){
        item.addEventListener("click", handleSelectedItem)
    }

    let selectedItems = []
    const collectedItems = document.querySelector("input[name=items]")


    function handleSelectedItem (event) {
        const itemLi = event.target

        //adicionar ou remover uma classe (ele verifica se tem a classe ou não) - Se fosse apenas adicionar usamos "add" e para remover usamos o "remove"
        itemLi.classList.toggle("selected")
        const itemId = itemLi.dataset.id

        //verificar se existem itens selecionados
        //Pegar itens selecionados 
        const alreadySelected = selectedItems.findIndex( item => {

        //Compara o item com o itemID (boolean) que obtivemos com a função que obteve o evento click
        const itemFound = item == itemId 
            return itemFound
        })
        
        //Se já tiver selecionado tirar da seleção
        if(alreadySelected >= 0){
            
            //tirar item da seleção
            const filteredItems = selectedItems.filter(item => {
                
                const itemIsDifferent = item != itemId
                return itemIsDifferent 
            })

            selectedItems = filteredItems
        } else {
        //Senão estiver, inserir na seleção
            selectedItems.push(itemId)
        }

        //Atualiar campo Hidden com os items selecionados 
        collectedItems.value = selectedItems
    }