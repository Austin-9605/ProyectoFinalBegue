// cargarDOM
document.addEventListener("DOMContentLoaded", function () {
    const header = document.getElementById("domHeader");

    const logo = document.createElement("div");
    logo.className = "logo";
    logo.textContent = "ROCA RIDGE";

    const nav = document.createElement("nav");

    const dropdown = document.createElement("div");
    dropdown.className = "dropdown";
    const btnDropdown = document.createElement("button");
    btnDropdown.textContent = "Productos";
    const contenidoDropdown = document.createElement("div");
    contenidoDropdown.className = 'dropdown-content';

    const btnCategoria1 = document.createElement("button");
    btnCategoria1.className = "filtro";
    btnCategoria1.textContent = "Botas";
    const btnCategoria2 = document.createElement("button");
    btnCategoria2.className = "filtro";
    btnCategoria2.textContent = "Camperas";
    const btnCategoria3 = document.createElement("button");
    btnCategoria3.className = "filtro";
    btnCategoria3.textContent = "Mochilas";
    const btnCategoria4 = document.createElement("button");
    btnCategoria4.className = "filtro";
    btnCategoria4.textContent = "Camping";
    const btnProductos = document.createElement("button");
    btnProductos.className = "catalogo";
    btnProductos.id = "catalogo";
    btnProductos.textContent = "Todos los Productos";

    contenidoDropdown.appendChild(btnCategoria1);
    contenidoDropdown.appendChild(btnCategoria2);
    contenidoDropdown.appendChild(btnCategoria3);
    contenidoDropdown.appendChild(btnCategoria4);
    contenidoDropdown.appendChild(btnProductos);
    dropdown.appendChild(btnDropdown);
    dropdown.appendChild(contenidoDropdown);

    const barraBusqueda = document.createElement("div");
    barraBusqueda.className = "busqueda";
    const inputBusqueda = document.createElement("input");
    inputBusqueda.id = "entrada"
    inputBusqueda.type = "text";
    inputBusqueda.placeholder = "Buscar...";

    barraBusqueda.appendChild(inputBusqueda);

    const btnMostrarOcultar = document.createElement("button");
    btnMostrarOcultar.className = "mostrarCarrito";
    btnMostrarOcultar.innerText = "Carrito";

    btnMostrarOcultar.addEventListener("click", () => {
        const carritoCompras = document.getElementById("carritoCompras");
        carritoCompras.classList.toggle("cartActivo");
        verCarrito();
    });

    nav.appendChild(dropdown);
    nav.appendChild(barraBusqueda);
    nav.appendChild(btnMostrarOcultar);

    header.appendChild(logo);
    header.appendChild(nav);

    btnCategoria1.addEventListener("click", () => filtrarPorCategoría("Botas"));
    btnCategoria2.addEventListener("click", () => filtrarPorCategoría("Camperas"));
    btnCategoria3.addEventListener("click", () => filtrarPorCategoría("Mochilas"));
    btnCategoria4.addEventListener("click", () => filtrarPorCategoría("Camping"));
    btnProductos.addEventListener("click", () => verCatalogo());

    barraBusqueda.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            buscarProductosPorNombre();
        }
    });

    const btnComprar = document.querySelector(".btnComprar");
    btnComprar.addEventListener("click", comprar);

    function comprar() {
        if (carrito.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Algo salió mal.",
                text: "El carrito se encuentra vacío.",
                toast: true,
                confirmButtonColor: "#ff8800",
                background: "#BEBDBD"

            });
        } else {
            Swal.fire({
                title: "¡Gracias por tu compra!",
                text: "¡Compra realizada con éxito!",
                icon: "success",
                confirmButtonColor: "#ff8800",
            });

            carrito = [];
            localStorage.removeItem("carrito");
            localStorage.removeItem("precioFinal");

            const divLista = document.querySelector(".listaCarrito");
            divLista.innerHTML = "";

            const precioFinal = document.getElementById("precioFinal");
            precioFinal.innerText = "$0";
        }
    }

    const precioFinalGuardado = localStorage.getItem("precioFinal");
    if (precioFinalGuardado) {
        const precioFinal = document.getElementById("precioFinal");
        precioFinal.innerText = `$${precioFinalGuardado}`;
    }

    verCatalogo();
});

const container = document.getElementById("container");
const cartButton = document.getElementById("btnCart");
const divCarrito = document.getElementById("cart");
const divLista = document.getElementsByClassName("listaCarrito");
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// FUNCIONES
function creadorCard(productos) {
    const card = document.createElement("div");
    card.className = "card";

    const titulo = document.createElement("p");
    titulo.innerText = productos.nombre;
    titulo.className = "title"

    const marca = document.createElement("p");
    marca.innerText = productos.marca;
    marca.className = "marca"

    const imagen = document.createElement("img");
    imagen.src = productos.imagen1;
    imagen.alt = "NOIMG"

    const precio = document.createElement("p");
    precio.innerText = `$${productos.precio}`;
    precio.className = "precio"

    const botonAñadir = document.createElement("button");
    botonAñadir.innerText = "Añadir"
    botonAñadir.className = "btnAñadir"
    botonAñadir.onclick = () => agregarAlCarrito(productos.id)

    card.appendChild(titulo);
    card.appendChild(marca);
    card.appendChild(imagen);
    card.appendChild(precio);
    card.appendChild(botonAñadir);

    container.appendChild(card);
}

function creadorCardCart(carrito) {
    const divLista = document.getElementsByClassName("listaCarrito")[0];

    const card = document.createElement("div");
    card.className = "cardCart";

    const imagen = document.createElement("img");
    imagen.src = carrito.imagen1;
    imagen.alt = "NOIMG"

    const titulo = document.createElement("p");
    titulo.innerText = carrito.nombre;
    titulo.className = "titleCart"

    const precio = document.createElement("p");
    precio.innerText = `$${carrito.precio}`;
    precio.className = "precioCart"

    const botonEliminar = document.createElement("button");
    botonEliminar.innerText = "X"
    botonEliminar.className = "btnEliminarCart"
    botonEliminar.addEventListener("click", () => eliminarDelCarrito(carrito.id));

    card.appendChild(imagen);
    card.appendChild(titulo);
    card.appendChild(precio);
    card.appendChild(botonEliminar);

    divLista.appendChild(card);
}

function verCarrito() {
    const divLista = document.getElementsByClassName("listaCarrito")[0];
    divLista.innerHTML = "";
    carrito.forEach(el => creadorCardCart(el));
}

function verCatalogo() {
    limpiarContenidoDom();

    fetch("./js/data.json")
        .then((response) => response.json())
        .then(data => {
            data.forEach(el => {
                creadorCard(el);
            });
        });
}

function agregarAlCarrito(id) {
    const divLista = document.getElementsByClassName("listaCarrito")[0]
    divLista.innerHTML = "";

    fetch("./js/data.json")
        .then((response) => response.json())
        .then(data => {
            const productoAlCarrito = data.find(el => el.id === id);
            if (carrito.some(e => e.id === productoAlCarrito.id)) {
                Swal.fire({
                    icon: "error",
                    title: "Algo salió mal.",
                    text: "El producto ya se encuentra en tu carrito",
                    toast: true,
                    confirmButtonColor: "#ff8800",
                    background: "#BEBDBD"

                });
                carrito.forEach(el => creadorCardCart(el));

            } else {
                carrito.push(productoAlCarrito);
                localStorage.setItem("carrito", JSON.stringify(carrito));

                Toastify({
                    text: "Producto añadido al carrito.",
                    duration: 1000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast();

                carrito.forEach(el => creadorCardCart(el));
                calculoPrecioFinal("sumar");
            }
        });
};

function eliminarDelCarrito(id) {
    const divLista = document.getElementsByClassName("listaCarrito")[0]
    divLista.innerHTML = "";
    let nuevoCarrito = carrito.filter(el => el.id !== id);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    carrito = nuevoCarrito;

    Toastify({
        text: "Producto eliminado del carrito.",
        duration: 1000,
        close: true,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, #ce1212, #ce3e12)",
        }
    }).showToast();

    carrito.forEach(el => creadorCardCart(el));
    calculoPrecioFinal("restar");
}

function limpiarContenidoDom() {
    container.innerHTML = "";
}

function filtrarPorCategoría(categoria) {
    limpiarContenidoDom();
    fetch("./js/data.json")
        .then((response) => response.json())
        .then(data => {
            const productosFiltrados = data.filter(producto => producto.categoria === categoria);
            productosFiltrados.forEach(producto => creadorCard(producto));
        })
}

function buscarProductosPorNombre() {
    let input = document.getElementById("entrada").value

    fetch("./js/data.json")
        .then((response) => response.json())
        .then(data => {
            const productosEncontrados = data.filter(producto => producto.nombre.includes(input.toUpperCase()));
            if (productosEncontrados.length > 0) {
                limpiarContenidoDom();
                productosEncontrados.forEach(producto => creadorCard(producto));
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Algo salió mal.",
                    text: "No hay productos que coincidan con tu búsqueda",
                    toast: true,
                    confirmButtonColor: "#ff8800",
                    background: "#BEBDBD",
                });
            }
        })
}

function calculoPrecioFinal(operacion) {
    let precioFinal = document.getElementById("precioFinal");
    precioFinal.innerText = "";
    let total = 0;
    if (operacion === "sumar") {
        carrito.forEach(el => total += el.precio)
    } else if (operacion === "restar") {
        carrito.forEach(el => total -= el.precio)
    }

    precioFinal.innerText = `$${Math.abs(total)}`;
    localStorage.setItem("precioFinal", Math.abs(total));
}



