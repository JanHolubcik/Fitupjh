Finished application should resemble [https://kaloricketabulky.sk/]. This is my own personal project for learning Next.js.



Project uses mongodb on localhost or you can also livehost it trough mongo.

## LIVEHOSTING YOU CAN CHECK APP HERE

[https://fitupjh.vercel.app/]

## Set up your env file

When cloning this repo we need to create file .env.local.

Having a mongo account and cluster is highy recomended

1. Create env file (.env.local) and inside file add following line:

```bash
MONGODB_URI=mongodb://(yourmongodblocalhost)/fitup
```

Database should create automatically after running npm run dev, if not create new database with name "fitup".

2. Create collection with name "food". And insert json file content in public folder.

## Some pictures showing the demo
<img width="1406" height="934" alt="obrázok" src="https://github.com/user-attachments/assets/4042094f-2ebf-4cf3-85d8-e1b01c7cc9c5" />
<img width="1263" height="936" alt="obrázok" src="https://github.com/user-attachments/assets/a5db4fe2-7bab-47ae-8aa1-32e879f877fd" />
<img width="1298" height="760" alt="obrázok" src="https://github.com/user-attachments/assets/207459ca-b186-4a5a-8493-ecd4680e29b8" />



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


