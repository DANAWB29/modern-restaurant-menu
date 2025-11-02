// Comprehensive Menu Data - 150+ Items
// Easy to edit: Just change name, description, price, category, and image URL

export const menuData = {
    categories: [
        { id: 'appetizers', name: 'Appetizers', icon: '🥗' },
        { id: 'soups', name: 'Soups', icon: '🍲' },
        { id: 'salads', name: 'Salads', icon: '🥙' },
        { id: 'mains', name: 'Main Courses', icon: '🍽️' },
        { id: 'pasta', name: 'Pasta & Rice', icon: '🍝' },
        { id: 'pizza', name: 'Pizza', icon: '🍕' },
        { id: 'seafood', name: 'Seafood', icon: '🐟' },
        { id: 'grills', name: 'Grills & BBQ', icon: '🔥' },
        { id: 'vegetarian', name: 'Vegetarian', icon: '🥬' },
        { id: 'desserts', name: 'Desserts', icon: '🍰' },
        { id: 'beverages', name: 'Beverages', icon: '🥤' },
        { id: 'coffee', name: 'Coffee & Tea', icon: '☕' }
    ],
    items: [
        // APPETIZERS (15 items)
        {
            id: 1,
            name: 'Caesar Salad',
            description: 'Fresh romaine lettuce with parmesan cheese, croutons, and caesar dressing',
            price: 12.99,
            category: 'appetizers',
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
            popular: true
        },
        {
            id: 2,
            name: 'Bruschetta',
            description: 'Toasted bread topped with fresh tomatoes, basil, and mozzarella',
            price: 9.99,
            category: 'appetizers',
            rating: 4.4,
            image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop'
        },
        {
            id: 3,
            name: 'Buffalo Wings',
            description: 'Spicy chicken wings served with blue cheese dip and celery sticks',
            price: 14.99,
            category: 'appetizers',
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop'
        },
        {
            id: 4,
            name: 'Mozzarella Sticks',
            description: 'Golden fried mozzarella cheese sticks with marinara sauce',
            price: 11.99,
            category: 'appetizers',
            rating: 4.3,
            image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=400&h=300&fit=crop'
        },
        {
            id: 5,
            name: 'Nachos Supreme',
            description: 'Tortilla chips loaded with cheese, jalapeños, sour cream, and guacamole',
            price: 13.99,
            category: 'appetizers',
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop'
        },
        {
            id: 6,
            name: 'Calamari Rings',
            description: 'Crispy fried squid rings served with spicy marinara sauce',
            price: 15.99,
            category: 'appetizers',
            rating: 4.4,
            image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop'
        },
        {
            id: 7,
            name: 'Stuffed Mushrooms',
            description: 'Button mushrooms stuffed with herbs, breadcrumbs, and cheese',
            price: 10.99,
            category: 'appetizers',
            rating: 4.2,
            image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&h=300&fit=crop'
        },
        {
            id: 8,
            name: 'Spinach Artichoke Dip',
            description: 'Creamy spinach and artichoke dip served with tortilla chips',
            price: 12.99,
            category: 'appetizers',
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&h=300&fit=crop'
        },
        {
            id: 9,
            name: 'Chicken Quesadilla',
            description: 'Grilled chicken and cheese in a crispy tortilla with salsa and sour cream',
            price: 13.99,
            category: 'appetizers',
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
        },
        {
            id: 10,
            name: 'Potato Skins',
            description: 'Crispy potato skins loaded with bacon, cheese, and green onions',
            price: 11.99,
            category: 'appetizers',
            rating: 4.3,
            image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=400&h=300&fit=crop'
        },
        {
            id: 11,
            name: 'Shrimp Cocktail',
            description: 'Fresh jumbo shrimp served with cocktail sauce and lemon',
            price: 16.99,
            category: 'appetizers',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop'
        },
        {
            id: 12,
            name: 'Onion Rings',
            description: 'Beer-battered onion rings served with ranch dipping sauce',
            price: 9.99,
            category: 'appetizers',
            rating: 4.2,
            image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop'
        },
        {
            id: 13,
            name: 'Jalapeño Poppers',
            description: 'Spicy jalapeños stuffed with cream cheese and wrapped in bacon',
            price: 12.99,
            category: 'appetizers',
            rating: 4.4,
            image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop'
        },
        {
            id: 14,
            name: 'Cheese Platter',
            description: 'Selection of artisan cheeses with crackers, grapes, and nuts',
            price: 18.99,
            category: 'appetizers',
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop'
        },
        {
            id: 15,
            name: 'Deviled Eggs',
            description: 'Classic deviled eggs topped with paprika and fresh herbs',
            price: 8.99,
            category: 'appetizers',
            rating: 4.1,
            image: 'https://images.unsplash.com/photo-1541544181051-e46607bc22a4?w=400&h=300&fit=crop'
        },

        // SOUPS (10 items)
        {
            id: 16,
            name: 'Tomato Basil Soup',
            description: 'Creamy tomato soup with fresh basil and a touch of cream',
            price: 7.99,
            category: 'soups',
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop'
        },
        {
            id: 17,
            name: 'Chicken Noodle Soup',
            description: 'Classic comfort soup with tender chicken, vegetables, and egg noodles',
            price: 8.99,
            category: 'soups',
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
            id: 18,
            name: 'French Onion Soup',
            description: 'Rich onion broth topped with melted Gruyère cheese and croutons',
            price: 9.99,
            category: 'soups',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop'
        },
        {
            id: 19,
            name: 'Mushroom Bisque',
            description: 'Creamy mushroom soup with wild mushrooms and herbs',
            price: 10.99,
            category: 'soups',
            rating: 4.4,
            image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop'
        },
        {
            id: 20,
            name: 'Clam Chowder',
            description: 'New England style clam chowder with tender clams and potatoes',
            price: 11.99,
            category: 'soups',
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop'
        },
        {
            id: 21,
            name: 'Minestrone Soup',
            description: 'Italian vegetable soup with beans, pasta, and fresh herbs',
            price: 8.99,
            category: 'soups',
            rating: 4.3,
            image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop'
        },
        {
            id: 22,
            name: 'Butternut Squash Soup',
            description: 'Roasted butternut squash soup with ginger and coconut milk',
            price: 9.99,
            category: 'soups',
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop'
        },
        {
            id: 23,
            name: 'Beef Barley Soup',
            description: 'Hearty soup with tender beef, barley, and root vegetables',
            price: 10.99,
            category: 'soups',
            rating: 4.4,
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
            id: 24,
            name: 'Lobster Bisque',
            description: 'Rich and creamy lobster soup with a hint of sherry',
            price: 15.99,
            category: 'soups',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop'
        },
        {
            id: 25,
            name: 'Lentil Soup',
            description: 'Healthy lentil soup with vegetables and aromatic spices',
            price: 7.99,
            category: 'soups',
            rating: 4.2,
            image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop'
        }
    ]
};

// Helper function to generate more items programmatically
export const generateMenuItems = () => {
    const additionalItems = [];
    let currentId = 26;

    // SALADS (15 items)
    const salads = [
        'Greek Salad', 'Cobb Salad', 'Waldorf Salad', 'Caprese Salad', 'Spinach Salad',
        'Arugula Salad', 'Quinoa Salad', 'Kale Salad', 'Nicoise Salad', 'Asian Chicken Salad',
        'Taco Salad', 'Chef Salad', 'Garden Salad', 'Fruit Salad', 'Pasta Salad'
    ];

    salads.forEach((name, index) => {
        additionalItems.push({
            id: currentId++,
            name,
            description: `Fresh ${name.toLowerCase()} with premium ingredients and house dressing`,
            price: Math.floor(Math.random() * 8) + 8, // $8-15
            category: 'salads',
            rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // 3.5-5.0
            image: `https://images.unsplash.com/photo-${1546793665 + index}-c74683f339c1?w=400&h=300&fit=crop`,
            popular: Math.random() > 0.8
        });
    });

    // MAIN COURSES (25 items)
    const mains = [
        'Grilled Salmon', 'Beef Tenderloin', 'Chicken Parmesan', 'Lamb Chops', 'Pork Tenderloin',
        'Duck Breast', 'Veal Marsala', 'Chicken Cordon Bleu', 'Beef Wellington', 'Fish and Chips',
        'Chicken Tikka Masala', 'Beef Stroganoff', 'Chicken Alfredo', 'Steak Diane', 'Roast Chicken',
        'Braised Short Ribs', 'Chicken Cacciatore', 'Beef Bourguignon', 'Coq au Vin', 'Osso Buco',
        'Chicken Marsala', 'Prime Rib', 'Rack of Lamb', 'Stuffed Chicken Breast', 'Grilled Swordfish'
    ];

    mains.forEach((name, index) => {
        additionalItems.push({
            id: currentId++,
            name,
            description: `Expertly prepared ${name.toLowerCase()} with seasonal vegetables and signature sauce`,
            price: Math.floor(Math.random() * 15) + 18, // $18-32
            category: 'mains',
            rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
            image: `https://images.unsplash.com/photo-${1467003909585 + index}-2f8a72700288?w=400&h=300&fit=crop`,
            popular: Math.random() > 0.7
        });
    });

    // PASTA & RICE (15 items)
    const pasta = [
        'Spaghetti Carbonara', 'Fettuccine Alfredo', 'Penne Arrabbiata', 'Lasagna Bolognese', 'Ravioli Spinach',
        'Linguine Clam Sauce', 'Gnocchi Pesto', 'Rigatoni Vodka', 'Tortellini Cream', 'Pad Thai',
        'Chicken Fried Rice', 'Vegetable Biryani', 'Risotto Mushroom', 'Paella Valenciana', 'Jambalaya'
    ];

    pasta.forEach((name, index) => {
        additionalItems.push({
            id: currentId++,
            name,
            description: `Authentic ${name.toLowerCase()} made with fresh ingredients and traditional methods`,
            price: Math.floor(Math.random() * 10) + 14, // $14-23
            category: 'pasta',
            rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
            image: `https://images.unsplash.com/photo-${1621996346565 + index}-e3dbc353d2e5?w=400&h=300&fit=crop`,
            popular: Math.random() > 0.8
        });
    });

    // PIZZA (12 items)
    const pizzas = [
        'Margherita Pizza', 'Pepperoni Pizza', 'Hawaiian Pizza', 'Meat Lovers Pizza', 'Vegetarian Pizza',
        'BBQ Chicken Pizza', 'White Pizza', 'Buffalo Chicken Pizza', 'Supreme Pizza', 'Mushroom Pizza',
        'Prosciutto Pizza', 'Four Cheese Pizza'
    ];

    pizzas.forEach((name, index) => {
        additionalItems.push({
            id: currentId++,
            name,
            description: `Wood-fired ${name.toLowerCase()} with fresh mozzarella and premium toppings`,
            price: Math.floor(Math.random() * 8) + 16, // $16-23
            category: 'pizza',
            rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
            image: `https://images.unsplash.com/photo-${1513843906582 + index}-c007cc5c4f92?w=400&h=300&fit=crop`,
            popular: Math.random() > 0.7
        });
    });

    // SEAFOOD (12 items)
    const seafood = [
        'Grilled Lobster', 'Pan Seared Scallops', 'Blackened Mahi Mahi', 'Coconut Shrimp', 'Crab Cakes',
        'Grilled Octopus', 'Salmon Teriyaki', 'Tuna Steak', 'Sea Bass', 'Halibut',
        'Shrimp Scampi', 'Cioppino'
    ];

    seafood.forEach((name, index) => {
        additionalItems.push({
            id: currentId++,
            name,
            description: `Fresh ${name.toLowerCase()} prepared with chef's special seasoning and accompaniments`,
            price: Math.floor(Math.random() * 12) + 22, // $22-33
            category: 'seafood',
            rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
            image: `https://images.unsplash.com/photo-${1565680018434 + index}-b513d5e5fd47?w=400&h=300&fit=crop`,
            popular: Math.random() > 0.8
        });
    });

    // GRILLS & BBQ (10 items)
    const grills = [
        'BBQ Ribs', 'Grilled Chicken', 'Beef Brisket', 'Pulled Pork', 'Grilled Vegetables',
        'Smoked Salmon', 'BBQ Chicken Wings', 'Grilled Portobello', 'Kebab Platter', 'Mixed Grill'
    ];

    grills.forEach((name, index) => {
        additionalItems.push({
            id: currentId++,
            name,
            description: `Smoky ${name.toLowerCase()} grilled to perfection with house BBQ sauce`,
            price: Math.floor(Math.random() * 10) + 18, // $18-27
            category: 'grills',
            rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
            image: `https://images.unsplash.com/photo-${1527477396000 + index}-e27163b481c2?w=400&h=300&fit=crop`,
            popular: Math.random() > 0.7
        });
    });

    // VEGETARIAN (12 items)
    const vegetarian = [
        'Veggie Burger', 'Stuffed Bell Peppers', 'Eggplant Parmesan', 'Vegetable Curry', 'Quinoa Bowl',
        'Mushroom Risotto', 'Caprese Stack', 'Veggie Wrap', 'Buddha Bowl', 'Ratatouille',
        'Stuffed Zucchini', 'Vegetable Stir Fry'
    ];

    vegetarian.forEach((name, index) => {
        additionalItems.push({
            id: currentId++,
            name,
            description: `Healthy ${name.toLowerCase()} packed with fresh vegetables and plant-based proteins`,
            price: Math.floor(Math.random() * 8) + 12, // $12-19
            category: 'vegetarian',
            rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
            image: `https://images.unsplash.com/photo-${1512621776951 + index}-2a4d0684f6d6?w=400&h=300&fit=crop`,
            popular: Math.random() > 0.8
        });
    });

    // DESSERTS (15 items)
    const desserts = [
        'Chocolate Lava Cake', 'Tiramisu', 'Cheesecake', 'Crème Brûlée', 'Apple Pie',
        'Ice Cream Sundae', 'Chocolate Mousse', 'Fruit Tart', 'Panna Cotta', 'Bread Pudding',
        'Lemon Meringue Pie', 'Chocolate Brownie', 'Strawberry Shortcake', 'Banoffee Pie', 'Gelato'
    ];

    desserts.forEach((name, index) => {
        additionalItems.push({
            id: currentId++,
            name,
            description: `Decadent ${name.toLowerCase()} made fresh daily by our pastry chef`,
            price: Math.floor(Math.random() * 6) + 7, // $7-12
            category: 'desserts',
            rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
            image: `https://images.unsplash.com/photo-${1606313564200 + index}-e75d5e30476c?w=400&h=300&fit=crop`,
            popular: Math.random() > 0.8
        });
    });

    // BEVERAGES (10 items)
    const beverages = [
        'Fresh Orange Juice', 'Lemonade', 'Iced Tea', 'Soda Selection', 'Sparkling Water',
        'Smoothie Bowl', 'Milkshake', 'Energy Drink', 'Coconut Water', 'Kombucha'
    ];

    beverages.forEach((name, index) => {
        additionalItems.push({
            id: currentId++,
            name,
            description: `Refreshing ${name.toLowerCase()} made with premium ingredients`,
            price: Math.floor(Math.random() * 4) + 4, // $4-7
            category: 'beverages',
            rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
            image: `https://images.unsplash.com/photo-${1608270586620 + index}-248524c67de9?w=400&h=300&fit=crop`,
            popular: Math.random() > 0.8
        });
    });

    // COFFEE & TEA (8 items)
    const coffee = [
        'Espresso', 'Cappuccino', 'Latte', 'Americano', 'Green Tea', 'Earl Grey', 'Chai Latte', 'Mocha'
    ];

    coffee.forEach((name, index) => {
        additionalItems.push({
            id: currentId++,
            name,
            description: `Premium ${name.toLowerCase()} made with artisan beans and expert brewing`,
            price: Math.floor(Math.random() * 3) + 3, // $3-5
            category: 'coffee',
            rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
            image: `https://images.unsplash.com/photo-${1495474472287 + index}-c24e77d79fcd?w=400&h=300&fit=crop`,
            popular: Math.random() > 0.8
        });
    });

    return additionalItems;
};