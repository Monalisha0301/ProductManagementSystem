
const API_URL = "http://localhost:8080/api/products";

let allProducts = [];


// Load products
function loadProducts() {

    fetch(API_URL)
        .then(response => {

            if (!response.ok) {
                throw new Error("Backend error");
            }

            return response.json();
        })

        .then(products => {

            allProducts = products;

            displayProducts(products);

            updateDashboard(products);
        })

        .catch(error => {

            console.error(error);

            document.getElementById("productList").innerHTML =
                "<p>Unable to connect to backend.</p>";
        });
}


// Display products
function displayProducts(products) {

    const productList = document.getElementById("productList");

    productList.innerHTML = "";

    if (products.length === 0) {

        productList.innerHTML =
            "<p>No products found.</p>";

        return;
    }


    products.forEach(product => {

        productList.innerHTML += `

            <div class="product-card">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <p class="product-price">
                    ₹${product.price}
                </p>

                <div class="product-actions">

                    <button
                        class="edit-btn"
                        onclick="openEditModal(
                            ${product.id},
                            '${product.name}',
                            ${product.price},
                            '${product.category}'
                        )">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteProduct(${product.id})">
                        Delete
                    </button>

                </div>

            </div>
        `;
    });
}


// Add product
function addProduct() {

    const name =
        document.getElementById("name").value.trim();

    const price =
        document.getElementById("price").value;

    const category =
        document.getElementById("category").value.trim();


    if (!name || !price || !category) {

        alert("Please fill all fields.");

        return;
    }


    const product = {

        name: name,

        price: Number(price),

        category: category
    };


    fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(product)

    })

    .then(response => {

        if (!response.ok) {
            throw new Error("Unable to add product");
        }

        return response.json();
    })

    .then(() => {

        alert("Product added successfully!");

        document.getElementById("name").value = "";
        document.getElementById("price").value = "";
        document.getElementById("category").value = "";

        loadProducts();
    })

    .catch(error => {

        console.error(error);

        alert("Unable to add product.");
    });
}


// Search
function searchProducts() {

    const searchText =
        document.getElementById("search")
        .value
        .toLowerCase();


    const filteredProducts =
        allProducts.filter(product =>

            product.name.toLowerCase()
                .includes(searchText)

            ||

            product.category.toLowerCase()
                .includes(searchText)
        );


    displayProducts(filteredProducts);
}


// Open edit modal
function openEditModal(id, name, price, category) {

    document.getElementById("editId").value = id;

    document.getElementById("editName").value = name;

    document.getElementById("editPrice").value = price;

    document.getElementById("editCategory").value = category;

    document.getElementById("editModal").style.display =
        "flex";
}


// Close modal
function closeModal() {

    document.getElementById("editModal").style.display =
        "none";
}


// Update product
function updateProduct() {

    const id =
        document.getElementById("editId").value;

    const name =
        document.getElementById("editName").value.trim();

    const price =
        document.getElementById("editPrice").value;

    const category =
        document.getElementById("editCategory").value.trim();


    if (!name || !price || !category) {

        alert("Please fill all fields.");

        return;
    }


    const product = {

        name: name,

        price: Number(price),

        category: category
    };


    fetch(`${API_URL}/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(product)

    })

    .then(response => {

        if (!response.ok) {
            throw new Error("Update failed");
        }

        return response.json();
    })

    .then(() => {

        alert("Product updated successfully!");

        closeModal();

        loadProducts();
    })

    .catch(error => {

        console.error(error);

        alert("Unable to update product.");
    });
}


// Delete product
function deleteProduct(id) {

    if (!confirm("Are you sure you want to delete this product?")) {
        return;
    }


    fetch(`${API_URL}/${id}`, {

        method: "DELETE"

    })

    .then(response => {

        if (!response.ok) {
            throw new Error("Delete failed");
        }

        return response.text();
    })

    .then(() => {

        alert("Product deleted successfully!");

        loadProducts();
    })

    .catch(error => {

        console.error(error);

        alert("Unable to delete product.");
    });
}


// Dashboard statistics
function updateDashboard(products) {

    document.getElementById("totalProducts").textContent =
        products.length;


    const categories = new Set(
        products.map(product => product.category)
    );

    document.getElementById("totalCategories").textContent =
        categories.size;


    const totalValue = products.reduce(
        (sum, product) =>
            sum + Number(product.price),
        0
    );


    document.getElementById("totalValue").textContent =
        "₹" + totalValue.toLocaleString("en-IN");
}


// Start application
loadProducts();

