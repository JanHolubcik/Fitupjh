This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

TODO: Mandatory login, styling, add gender and age to user, live hosting.

After the app is ready, I will p
ost link with live hosting.

Finished application should resemble [https://kaloricketabulky.sk/]. This is my own personal project for learning Next.js.
![image](https://github.com/user-attachments/assets/27e8125a-ee63-4702-af93-5e6259fbf29b)


Project uses mongodb on localhost.

## Set up your env file!!!

Once live hosting will be online there will be no need for local hosting.

I recommend using Mongodb Compass.

1. Create env file (.env.local) and inside file add following line:

```bash
MONGODB_URI=mongodb://(yourmongodblocalhost)/fitup
```

Database should create automatically after running npm run dev, if not create new database with name "fitup".

2. Create collection with name "food". And insert json file content in public folder.

## Getting Started

If you want to run the application, first u need to:

1. Download the repo.

2. Open project in your favorite editor and install and run.

```bash
npm i
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
