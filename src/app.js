const http = require ('http');

const express = require ('express');
const products = require ('./products.json');
const carrito = require ('./carrito.json');

const app = express ()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/saludo', (req,res)=>{
    res.send("Hola a todos, pero ahora desde express!")
})

app.post('/api/product', (req,res)=>{
    const dataRequest =  req.body;

    const listadoTotal =  carrito.items // inicialmente empieza en 0

    const cantidadDeProductos = listadoTotal.length

    const product = {
        id: cantidadDeProductos + 1,
        title: dataRequest.title,
        description: dataRequest.description,
        code: dataRequest.code,
        price: dataRequest.price ,
        status: dataRequest.status ?? true,
        stock: dataRequest.stock,
        category: dataRequest.category,
    }

    listadoTotal.push(product)

    res.send(listadoTotal)
})

app.put ('/api/product/:id', (req,res)=>{
    const productId =  req.params.id;
    const nuevoTitulo = req.body.title;

    const productoSeleccionado = products.items.find((product) => {
        return product.id === Number(productId)
    })

    productoSeleccionado.title = nuevoTitulo
    res.send(products.items)
})

app.delete ('/api/product/:id', (req,res)=>{
    const productId =  req.params.id;

    const productosFiltrados = products.items.filter((product) => {
        return product.id !== Number(productId)
    })

    res.send(productosFiltrados)
})



const server = http.createServer ((request, response)=>{
    response.end("Mi primer hola mundo dsede backend")
})

app.listen (8080, ()=>{
    
    console.log ("Listening on port 8080")
})
