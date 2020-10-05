let $ = (ele) => document.querySelector(ele);
let $$ = (ele) => document.querySelectorAll(ele);

let category = $('.active').innerHTML.toLowerCase();

function horizToDropMenu() {
    let ul = $('nav ul');
    if(ul.classList.contains('drop-menu')){
        ul.classList.remove('drop-menu')
        ul.classList.add('pages');
    }
    else{
        ul.classList.add('drop-menu');
        ul.classList.remove('pages');
    }
}
function openSearchBar(){
    let search = $('.search-icon');
    let input = $('.search');
    if(input.style.opacity == 1){
        input.style.opacity = 0;
    }
    else{
        input.style.opacity = 1;
    }
}

function openCart(){
    let productDescription = JSON.parse(localStorage.getItem('productsInCart'));
    let flag = 0 ;
    Object.values(productDescription).map(pd => {
        if(pd.inCart){
            $('#one').style.display = "block";
            $('.close-cart').classList.add('clicked');
            $('#one').style.zIndex = 2;
            flag ++ ;
        }
    });
    if($('.close-cart').classList.contains('clicked')){
        $('.bag-container').style.opacity = 0 ;
    }
    if(flag == 0){
        $('#one').style.display = "none";
    }
}
function closeCart(){
    $('#one').style.display = "none";
    $('.bag-container').style.opacity = 1 ;
}

// let cart = $('#one');

// window.onclick = function(e){
//     if(e.target == cart){
//         closeCart();
//     }
// }

products.forEach(product =>{
    let category = product.category.toLowerCase();
    $('main').innerHTML += `
    <div class="single-product ${category}">
        <div class="image-container">
            <img src="${product.imgSrc}" alt="${product.name}" />
            <button class="add_toCart_btns">
                <i class="fas fa-cart-plus"></i> ADD TO CART 
            </button>
        </div>
        <a>
            <h3>${product.name}</h3>
            <h4>$${product.price} CAD </h4>
        </a>
    </div>
    `;
});

let all_items = $$('main .single-product');
let addToCart_btns = $$('main buttons');

function displayParticularItems(){
    for (let i = 0 ; i < all_items.length ; i++){
        if(all_items[i].classList.contains(category)){
            all_items[i].style.display = '';
        }else{
            all_items[i].style.display ='none';
        }
    }
}

let list = $('ul.category-list').getElementsByTagName('li');

for(let i = 0; i<list.length; i++){
    list[i].onclick = function (){
        list[i].style.color = '#ffbe63';
        for(let j = 0 ; j < list.length ; j++){
            if(j == i){
                continue ;
            }
            list[j].style.color = "white";
        }
        let active_now = $('.active');
        category = this.innerHTML.toLowerCase();
        active_now.classList.remove('active');
        this.classList.add('active');
        displayParticularItems();
    }
};

function search(){
    let input = document.getElementById('myInput').value.toLowerCase();
    let product_name = $$('.single-product h3');
    product_name.forEach(name => {
        if(name.innerText.toLowerCase().includes(input)){
            name.parentElement.parentElement.style.display = '';
        }
        else{
            name.parentElement.parentElement.style.display = 'none';
        }
    });
}
$('#myInput').onkeyup = () => search();

function no_of_cartitems(product){
    let x_items = localStorage.getItem('noOfCartItems');
    x_items=parseInt(x_items);
    if(x_items){
        x_items++ ;
    }else{
        x_items = 1;
    }
    localStorage.setItem('noOfCartItems',x_items)
    $('.no_of_cartitems').innerText = x_items;

    disp_item_details_incart(product);
}

function total_cart_cost(product){
    let totalCartCost = localStorage.getItem('totalCartCost');
    totalCartCost = parseInt(totalCartCost);
    if(totalCartCost){
        totalCartCost += product.price;
    }else{
        totalCartCost = product.price;
    }
    localStorage.setItem('totalCartCost',totalCartCost);
}

function disp_item_details_incart(product){
    let productDescription = localStorage.getItem('productsInCart');
    productDescription = JSON.parse(productDescription);

    if(productDescription != null)
    {
        if(productDescription[product.id] == undefined){
            productDescription = {
                ...productDescription,
                [product.id] : product
            }
        }
        productDescription[product.id].inCart += 1 ;
    }else
    {
        productDescription = {
            [product.id] : product,
        }
        product.inCart = 1 ;
    }

    localStorage.setItem('productsInCart',JSON.stringify(productDescription));
}

function set_cart(){ 
    let productDescription = JSON.parse(localStorage.getItem('productsInCart'));
    let cartItems = $('.cart-items');
    let totalCartCost = localStorage.getItem('totalCartCost');
    let temp = 0, flag = false ;
    
    if(productDescription)
    {
        cartItems.innerHTML = '';
        Object.values(productDescription).map(pd => {
            if(pd.inCart){
                flag = true ;
            temp += (pd.inCart*pd.price);
            cartItems.innerHTML += `
            <article class="single-cart-item">
            <div class="product">
                <span class="${pd.id}"><button class="removeBtn" style="cursor:pointer ; margin-right:7px;" >X</button></span>
                <img src="${pd.imgSrc}" />
                <a class="incart-productname">${pd.name}</a>
            </div>
                    <div class="price" >$ ${pd.price}</div>
                    <div class="quantity ${pd.name}">
                        <span class="${pd.id}">
                            <button class="minusBtn" style="cursor:pointer ; margin-right:7px ; font-size:17px ;" >-</button>
                        </span>
                        ${pd.inCart} 
                        <span class="${pd.id}">
                            <button class="plusBtn" style="cursor:pointer ; margin-left:7px ; font-size:17px ;" >+</button>
                        </span>
                    </div>
                    <div class="total">$ ${(pd.inCart)*(pd.price)}</div>
                    </article>
                    `;
            }
        });
    }
            if(flag = false){
                document.getElementById('one').style.transform = "scale(0)";
            }
            $('.cart-cost').innerText = '$ ' + temp ;
            localStorage.setItem('totalCartCost',temp);
            remove_item();
            add_item_from_cart();
            minus_item_from_cart();
}
        
let buttons = $$('.add_toCart_btns');
        
for(let i = 0 ; i < buttons.length ; i++){
    buttons[i].onclick = function(){
        no_of_cartitems(products[i]);
        total_cart_cost(products[i]);
        set_cart();
    }
}
        
function checkLocalStorage(){
    let x_items_in_storage = localStorage.getItem('noOfCartItems');
    x_items_in_storage = parseInt(x_items_in_storage);
    if(x_items_in_storage){
        $('.no_of_cartitems').innerText = x_items_in_storage;
    }else{
        $('.no_of_cartitems').innerText = 0;
    }
}

function add_item_from_cart(){
    let productDescription = JSON.parse(localStorage.getItem('productsInCart'));
    let totalCartCost = parseInt(localStorage.getItem('totalCartCost'));
    let cartItems = parseInt(localStorage.getItem('noOfCartItems'));
    let addItemBtns = $$('.plusBtn');
    for(let i = 0 ; i < addItemBtns.length ; i++){
        addItemBtns[i].onclick = function(){
            let caught = addItemBtns[i].parentElement.classList[0];
            Object.values(productDescription).map(pd => {
                if(pd.id == caught){
                    pd.inCart++ ;
                    totalCartCost = totalCartCost + pd.price ;
                    cartItems++ ;
                    localStorage.setItem('totalCartCost',totalCartCost);
                    localStorage.setItem('noOfCartItems',cartItems);
                    localStorage.setItem('productsInCart',JSON.stringify(productDescription));
                    checkLocalStorage();
                    set_cart();
                }
            });
        }
    }
}

function minus_item_from_cart(){
    let productDescription = JSON.parse(localStorage.getItem('productsInCart'));
    let totalCartCost = parseInt(localStorage.getItem('totalCartCost'));
    let cartItems = parseInt(localStorage.getItem('noOfCartItems'));
    let minusItemBtns = $$('.minusBtn');
    for(let i = 0 ; i < minusItemBtns.length ; i++){
        minusItemBtns[i].onclick = function(){
            let caught = minusItemBtns[i].parentElement.classList[0];
            Object.values(productDescription).map(pd => {
                if(pd.id == caught){
                    pd.inCart-- ;
                    totalCartCost = totalCartCost - pd.price ;
                    cartItems-- ;
                    localStorage.setItem('totalCartCost',totalCartCost);
                    localStorage.setItem('noOfCartItems',cartItems);
                    localStorage.setItem('productsInCart',JSON.stringify(productDescription));
                    checkLocalStorage();
                    set_cart();
                }
            });
        }
    }
}
function remove_item(){
    let productDescription = JSON.parse(localStorage.getItem('productsInCart'));
    let removeItemBtns = $$('.removeBtn');
    let totalCartCost = parseInt(localStorage.getItem('totalCartCost'));
    let cartItems = parseInt(localStorage.getItem('noOfCartItems'));
    for(let i = 0 ; i < removeItemBtns.length ; i++){
        removeItemBtns[i].onclick = function(){
            let caught = removeItemBtns[i].parentElement.classList[0];
            Object.values(productDescription).map(pd => {
                if(pd.id == caught){
                    totalCartCost = totalCartCost - (pd.inCart*pd.price);
                    cartItems=cartItems - pd.inCart;
                    pd.inCart = 0 ;
                    localStorage.setItem('productsInCart',JSON.stringify(productDescription));
                    $('.no_of_cartitems').innerText = cartItems;
                    localStorage.setItem('noOfCartItems',cartItems);
                    localStorage.setItem('totalCartCost', totalCartCost);
                    checkLocalStorage();
                    set_cart();
                }

            });
            removeItemBtns[i].parentElement.parentElement.parentElement.remove();
        }
    }
    if(removeItemBtns.length == 0){
        closeCart();
        if($('.close-cart').classList.contains('clicked')){
            $('.close-cart').classList.remove('clicked');
        }
    }
}  

window.onscroll = () => {
    let nav = $('#two');
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        nav.classList.add('scrolly');
    } else {
        nav.classList.remove('scrolly');
      }
}
window.onload = function (){
    displayParticularItems();
    checkLocalStorage();
    set_cart();
    // $('ul li.active').innerHTML.style.color = 'yellowgreen';
}