create table
    users (
        id int primary key auto_increment,
        username varchar(50) unique not null,
        email varchar(100) unique not null,
        password varchar(150) not null
    );

create table
    wishlist_items (
        product_id int,
        user_id int,
        FOREIGN KEY (product_id) references products(id),
        FOREIGN KEY (user_id) references users(id)
    );

create table
    cart_items (
        product_id int,
        user_id int,
        FOREIGN KEY (product_id) references products(id),
        FOREIGN KEY (user_id) references users(id)
    );