Finished application should resemble [https://kaloricketabulky.sk/]. This is my own personal project for learning Next.js.
![image](https://github.com/user-attachments/assets/27e8125a-ee63-4702-af93-5e6259fbf29b)


Project uses mongodb on localhost or you can also livehost it trough mongo.

## LIVEHOSTING YOU CAN CHECK APP HERE

[https://fitupjh.vercel.app/]

## Set up your env file

When cloning this repo we need to create file .env.local.

Having a mongo account and cluster is highy recomndet

1. Create env file (.env.local) and inside file add following line:

```bash
MONGODB_URI=mongodb://(yourmongodblocalhost)/fitup
```

Database should create automatically after running npm run dev, if not create new database with name "fitup".

2. Create collection with name "food". And insert json file content in public folder.

<img width="1045" height="785" alt="image" src="https://github.com/user-attachments/assets/3dd63b89-d3e9-4bb3-a3ce-c1807215371c" />
<img width="1083" height="803" alt="image" src="https://github.com/user-attachments/assets/7f37bf9c-532b-435e-9b7b-d0c51084fd6a" />
<img width="1055" height="765" alt="image" src="https://github.com/user-attachments/assets/ffa60721-5ed2-49ab-8118-057f78734f69" />


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


