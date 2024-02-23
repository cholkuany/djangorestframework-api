const loginForm = document.getElementById('login-form')
const searchForm = document.getElementById('search-form')

const contentBox = document.getElementById('content-box')

const baseEndpoint = 'http://localhost:8000/api'

loginForm.addEventListener('submit', loginFormHandle)
searchForm.addEventListener('submit', searchFormHandle)

function loginFormHandle(event){
    console.log(event)
    event.preventDefault()

    loginEndpoint = `${baseEndpoint}/token`
    let loginFormData = new FormData(loginForm)
    console.log(loginFormData)
    let loginObjectData = Object.fromEntries(loginFormData)
    console.log(loginObjectData)
    let data = JSON.stringify(loginFormData)

    options = {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post',
        body: data
    }

    fetch(loginEndpoint, options)
    .then(response => response.json())
    .then(authdata => {
        handleAuthData(authdata, getProductList)
    })
    .catch(err => {
        console.log(`ERROR: ${err}`)
    })

}

function searchFormHandle(event){
    event.preventDefault()

    let formData = new FormData(searchForm)
    let data = Object.fromEntries(formData)
    let searchParams = new URLSearchParams(data)

    const searchEndpoint = `${baseEndpoint}/search/?${searchParams}`
    const headers = {
        'Content-Type': 'application/json',
    }
    const authToken = localStorage.getItem('access')
    if (authToken){
        headers['Authorization'] = `Bearer ${authToken}`
    }

    options = {
        headers: headers,
        method: 'get',
    }

    fetch(searchEndpoint, options)
    .then(response => response.json())
    .then(data => {
        const isValidData = isTokenValid(data)
        
        if (isValidData && data.hits && data.hits.length !== 0){
            let htmlStr = ""
            for (let result of data.hits){
                htmlStr += "<li>" + result.title + "</li>"
            }
            contentBox.innerHTML = htmlStr
        }
        
        else {
            contentBox.innerHTML = "<p>No results found</p>"
        }
        writeToContentBox(data)
    })
    .catch(err => {
        console.log(`ERROR: ${err}`)
    })

}
function handleAuthData(authData, callback){
    localStorage.setItem('access', authData.access)
    localStorage.setItem('refresh', authData.refresh)

    callback()
}

function writeToContentBox(data){
    contentBox.innerHTML = "<pre>" + JSON.stringify(data, null, 4) + "</pre>"
}
function isTokenValid(jsonData){
    if (jsonData.code && jsonData.code === 'token_not_valid'){
        alert('Please login again')
        return false
    }
    return true
}
function getProductList(){
    const endpoint = `${baseEndpoint}/products`
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
        }
    }
    fetch(endpoint, options)
    .then(response => response.json())
    .then(data => {
        let isValid = isTokenValid(data)
        if (isValid){
            writeToContentBox(data)
        }
    })
}


const searchClient = algoliasearch('QOYSWXOGZQ', 'a9e8acba67997770a5f698741b1e4ecd');

const search = instantsearch({
  indexName: 'cfe-app_Product',
  searchClient,
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),

  instantsearch.widgets.clearRefinements({
    container: '#clear-refinements'
  }),

  instantsearch.widgets.refinementList({
    container: '#user-list',
    attribute: 'user'
  }),

  instantsearch.widgets.refinementList({
    container: '#public-list',
    attribute: 'public'
  }),

  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
        item: `<div>
        <div> {{#helpers.highlight}}{ "attribute": "title" }{{/helpers.highlight}}</div>
        <div> {{#helpers.highlight}}{ "attribute": "body" }{{/helpers.highlight}}</div>
        <p>{{ user }}</p><p>\${{ price }}</p>
        </div>`
    }
  })
]);

search.start();
