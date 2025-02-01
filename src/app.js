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


// actualziar producto mediante el id
app.put ('/api/product/:id', (req,res)=>{
    const productId =  req.params.id;
    const nuevoTitulo = req.body.title;

    const productoSeleccionado = products.items.find((product) => {
        return product.id === Number(productId)
    })

    productoSeleccionado.title = nuevoTitulo
    res.send(products.items)
})

//borra el producto mediante el id
app.delete ('/api/product/:id', (req,res)=>{
    const productId =  req.params.id;

    const productosFiltrados = products.items.filter((product) => {
        return product.id !== Number(productId)
    })

    res.send(productosFiltrados)
})


// crear nuevo producto en producto.json
app.post('/api/product', (req,res)=>{
    const nuevoProducto =  req.body;

    const listadoDeProductos =  products.listadoProductos // inicialmente empieza en 0

    const cantidadDeProductos = listadoDeProductos.length

    const product = {
        id: cantidadDeProductos,
        title: nuevoProducto.title,
        description: nuevoProducto.description,
        code: nuevoProducto.code,
        price: nuevoProducto.price ,
        status: nuevoProducto.status ?? true,
        stock: nuevoProducto.stock,
        category: nuevoProducto.category,
    }

    listadoDeProductos.push(product)

    res.send(listadoDeProductos)
})


///  CARRITO ///

// cargar productos en el array del carrito
app.post('/api/carts', (req,res)=>{
    const productosRecibidos =  req.body;
    
    const carritoCompleto = carrito.listadoDeCarritos[0]

    const listadoProductosEnCarrito =  carritoCompleto.listadoProductos


    for (let index = 0; index < productosRecibidos.length; index++) {
        
        let producto = {
            id: index,
            title: productosRecibidos[index].title,
            description: productosRecibidos[index].description,
            code: productosRecibidos[index].code,
            price: productosRecibidos[index].price ,
            status: productosRecibidos[index].status ?? true,
            stock: productosRecibidos[index].stock,
            category: productosRecibidos[index].category,
            quantity: productosRecibidos[index].quantity,
        }
        listadoProductosEnCarrito.push(producto)
    }

    res.send(carritoCompleto)
})

//borra el producto mediante el id del carrito
app.delete ('/api/carts/:id', (req,res)=>{
    const productId =  req.params.id;

    const productosFiltrados = products.items.filter((product) => {
        return product.id !== Number(productId)
    })

    res.send(productosFiltrados)
})

// devuelve carrito por el id que le pasamos
app.get('/api/carts/:cid', (req,res)=>{
    const carritoId =  req.params.cid;

    const carritoFiltrado = carrito.listadoDeCarritos.filter((carrito) => {
        return carrito.idCarrito === Number(carritoId)
    })

    res.send(carritoFiltrado)
})

// se agrega el id del producto al listado de productos en el carrito que le envio el idCarrito como parametro

app.post('/api/carts/:cid/product/:pid', (req, res) => {
    const productId = Number(req.params.pid); // pid id producto
    const carritoId = Number(req.params.cid); // cid id carrito

    const listadoDeProductos =  products.listadoProductos;
    const listadoDeCarritos = carrito.listadoDeCarritos;

    const carritoSeleccionado = listadoDeCarritos.find(item => item.idCarrito === carritoId)

    const productoSeleccionad = listadoDeProductos.find(item => item.id === productId)


    let productRepetido = false;

    if (carritoSeleccionado.listadoProductos.length > 0) {


        for (let index = 0; index < carritoSeleccionado.listadoProductos.length; index++) {

            let productoSeleccionado = carritoSeleccionado.listadoProductos[index]
            if (productoSeleccionado.product === productId) {
                productRepetido = true;
                productoSeleccionado.quantity = productoSeleccionado.quantity + 1
            }
            
        }
    }

    if (productRepetido === false) {
        carritoSeleccionado.listadoProductos.push({ 
            product: productoSeleccionad.id, 
            quantity: productoSeleccionad.quantity 
        })
    }
    
    res.send(carritoSeleccionado)

})



const server = http.createServer ((request, response)=>{
    response.end("Mi primer hola mundo dsede backend")
})

app.listen (8080, ()=>{
    
    console.log ("Listening on port 8080")
})
