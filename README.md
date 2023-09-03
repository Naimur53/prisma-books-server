## Live Link

https://prisma-books-server.vercel.app/

## Application Routes

### user

- `POST` https://prisma-books-server.vercel.app/api/v1/auth/signup
- `POST` https://prisma-books-server.vercel.app/api/v1/auth/sigin
- `GET` https://prisma-books-server.vercel.app/api/v1/users
- `POST` https://prisma-books-server.vercel.app/api/v1/auth/refresh-token

### Auth (Admin)

- `POST` https://prisma-books-server.vercel.app/api/v1/admins/create-admin
- `POST` https://prisma-books-server.vercel.app/api/v1/admins/login

### User

- `GET` https://prisma-books-server.vercel.app/api/v1/users
- `GET` https://prisma-books-server.vercel.app/api/v1/users/64a2a4ddebf5cff362b24b5a (Single GET)
- `PATCH` https://prisma-books-server.vercel.app/api/v1/users/64a2a4ddebf5cff362b24b5a
- `DELETE` https://prisma-books-server.vercel.app/api/v1/users/64a2a4ddebf5cff362b24b5a

### Cows

- `GET` https://prisma-books-server.vercel.app/api/v1/cows
- `GET` https://prisma-books-server.vercel.app/api/v1/cows/64a2bb978deaaebde8fed26e
- `PATCH` https://prisma-books-server.vercel.app/api/v1/cows/64a2bb978deaaebde8fed26e
- `DELETE` https://prisma-books-server.vercel.app/api/v1/cows/64a2bb978deaaebde8fed26e

### Orders

- `POST` https://prisma-books-server.vercel.app/api/v1/orders two id ->({buyer:64a2a3ea9ab67ec922c3c67e,cow:64a2bbf17403d668efd85fb9})
- `GET` https://prisma-books-server.vercel.app/api/v1/orders

### Bonus Part

### Admin

- `POST` https://prisma-books-server.vercel.app/api/v1/admins/create-admin

### My profile

- `GET` https://prisma-books-server.vercel.app/api/v1/users/my-profile
- `PATCH` https://prisma-books-server.vercel.app/api/v1/users/my-profile

### Order

- `GET` https://prisma-books-server.vercel.app/api/v1/orders/64a30849f22e510391a25754
