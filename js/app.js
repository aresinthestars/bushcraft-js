
const contenedorProductos = document.querySelector("#contenedor-productos");
const contenedorKit = document.querySelector("#contenedor-kit");
const totalKit = document.querySelector("#total-kit");
const botonFinalizar = document.querySelector("#finalizar-kit");

let productosDisponibles = [];
const kitIds = [];



fetch("./data/productos.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al cargar los productos");
        }

        return response.json();
    })

    .then(productos => {
        productosDisponibles = productos;

        productos.forEach(producto => {
            contenedorProductos.innerHTML += `
            <article>
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio}</p>
                <p>Categoría: ${producto.categoria}</p>
                <button class="boton-agregar" data-id="${producto.id}">Agregar al kit</button>
            </article>
        `;
        });
        const botonesAgregar = document.querySelectorAll(".boton-agregar");




        botonesAgregar.forEach(boton => {
            boton.addEventListener("click", () => {
                const idProducto = Number(boton.dataset.id);

                kitIds.push(idProducto);

                renderizarKit();
            });
        });
    })


    .catch(() => {
        contenedorProductos.innerHTML = `
        <p>No se pudieron cargar los productos. Intentá nuevamente más tarde.</p>
    `;
    });


function renderizarKit() {
    contenedorKit.innerHTML = "";

    let total = 0;

    kitIds.forEach(id => {
        const producto = productosDisponibles.find(producto => producto.id === id);

        contenedorKit.innerHTML += `
         <div>
          <p>${producto.nombre} - $${producto.precio}</p>
          <button class="boton-eliminar" data-id="${producto.id}">Eliminar</button>
         </div>
`;

        total += producto.precio;
    });

    totalKit.textContent = `Total: $${total}`;



    const botonesEliminar = document.querySelectorAll(".boton-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", () => {
            const idProducto = Number(boton.dataset.id);
            const posicion = kitIds.indexOf(idProducto);

            kitIds.splice(posicion, 1);

            renderizarKit();
        });
    });

}

botonFinalizar.addEventListener("click", () => {
    if (kitIds.length === 0) {
        Toastify({
            text: "Tu kit está vacío",
            duration: 3000
        }).showToast();

        return;
    }

    kitIds.length = 0;
    renderizarKit();

    Toastify({
        text: "Kit finalizado correctamente",
        duration: 3000
    }).showToast();
});

