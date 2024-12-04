# cafe-hopper-client

### Installation

```
git clone git@github.com:waylonwilliams/cafe-hopper-client.git
npm i
npm run ios
```

`npm run android` for android

You may also need the server repo running

### API Keys

You will need to make a `.env` file and add the following supabase keys:

```
EXPO_PUBLIC_SUPABASE_URL=<YOUR_PUBLIC_SUPABASE_URL>
EXPO_PUBLIC_SUPABASE_KEY=<YOUR_PUBLIC_SUPABASE_KEY>
```

### Before push

`npm run lint` and solve any issues there are

`npx prettier . --write` format all code

`git merge main` make sure you are up to date with main

You might need to download XCode and other stuff for a simulator, or you can download the expo app and scan the qr code to see it on your phone
