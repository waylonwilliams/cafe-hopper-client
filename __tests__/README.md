# Testing

## Install necessary packages

`npm i`

## Run test

`npm run test`  
(Check console if any additional modules need to be installed)  
Test is automated and is re-run everytime any change is made.  
If you wish to restart the test manually, press `enter`  
If you wish to quit the automated tester, press `q` or `ctrl+c`

## Tests (as of now):

`start-test.tsx`: `@/app/index.tsx`

- "redirects to tabs page if user is logged in"
- "renders the "Get started" page if no user is logged in"

`sign-up-test.tsx`: `@/app/signUp.tsx`

- "renders all fields and buttons"
- "navigates to login screen"
- "shows an alert if passwords do not match"
- "signs up user and navigates to tabs if successful"
- "shows alerts for errors during signup or profile creation"
- "allows toggling password visibility"

`login-test.tsx`: `@/app/login.tsx`

- "renders the login screen correctly"
- "toggles password visibility"
- "calls signInWithEmail and navigates on successful login"
- "shows an alert on login error"
- "navigates to the sign-up page"

`CardTest.tsx`: `@/components/Card.tsx`

- "renders Card Component correctly"
- "renders default image when cafe image is null"
- "navigates to cafe on press"
- "handle no rating"

`CafeTest.tsx`: `@/components/CafePage/Cafe` and `@/components/CafePage/CafeTypes`

- "renders cafe details correctly"
- "toggles the to-go button on click"
- "toggles the like button on click"
- "calls logVisit when 'Log a visit' is pressed"
- "Shows average review rating"

`ReviewTest.tsx`: `@/components/Review` and `@/components/CafePage/CafeTypes`

- "Renders review contents
