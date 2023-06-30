### Live Link: https://l2a3-cow-hut-backend-assignment-sabbir1054.vercel.app/

### Application Routes:

- Here all id from my database

#### User

- api/v1/auth/signup (POST)
- api/v1/users (GET)
- api/v1/users/649c24bbb6c9284e7bbc523f (Single GET)
- api/v1/users/649c24bbb6c9284e7bbc523f (PATCH)
- api/v1/users/649c24bbb6c9284e7bbc523f (DELETE)

#### Cows

- api/v1/cows (POST)
- api/v1/cows (GET)
- api/v1/cows/649cef36f98432f109d33cf9 (Single GET)
- api/v1/cows/649cef36f98432f109d33cf9 (PATCH)
- api/v1/cows/649cef36f98432f109d33cf9 (DELETE)

### Pagination and Filtering routes of Cows

- api/v1/cows?pag=1&limit=10
- api/v1/cows?sortBy=price&sortOrder=asc
- api/v1/cows?minPrice=20000&maxPrice=70000
- api/v1/cows?location=Barishal
- api/v1/cows?searchTerm=Dha

#### Orders

- api/v1/orders (POST)
- api/v1/orders (GET)
