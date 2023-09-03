## Live Link

https://prisma-books-server.vercel.app/

## Application Routes

### user

- `POST` https://prisma-books-server.vercel.app/api/v1/auth/signup
- `POST` https://prisma-books-server.vercel.app/api/v1/auth/sigin
- `GET` https://prisma-books-server.vercel.app/api/v1/users
- `GET` https://prisma-books-server.vercel.app/api/v1/users/48c34655-4fef-42d4-aad1-9a4919f6858e
- `PATCH` https://prisma-books-server.vercel.app/api/v1/users/48c34655-4fef-42d4-aad1-9a4919f6858e
- `DELETE` https://prisma-books-server.vercel.app/api/v1/users/48c34655-4fef-42d4-aad1-9a4919f6858e
- `GET` https://prisma-books-server.vercel.app/api/v1/profile

### Category

- `POST` https://prisma-books-server.vercel.app/api/v1/categories/create-category
- `GET` https://prisma-books-server.vercel.app/api/v1/categories
- `GET` https://prisma-books-server.vercel.app/api/v1/categories/9efa91b1-22a5-4250-acc5-a9e9f43a3717
- `PATCH` https://prisma-books-server.vercel.app/api/v1/categories/9efa91b1-22a5-4250-acc5-a9e9f43a3717
- `DELETE` https://prisma-books-server.vercel.app/api/v1/categories/9efa91b1-22a5-4250-acc5-a9e9f43a3717

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
