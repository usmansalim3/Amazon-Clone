
# Amazon Clone

A full Stack Amazon Clone made using React Native , ExpressJS along with Global State Management using Redux Toolkit.


## Features

- User Authentication through JWT
- Add , delete , edit multiple addresses for a single user 
- Rate products , write reviews and upload pictures in the reviews section
- All review pictures are uploaded to Cloudinary
- Add products to wishlist and place orders
- Go through orders history and view the summary 
- Apply various filters while searching products
- Sticky header that collapses on scroll


## Optimizations

- Replacing a screen instead of pushing another screen on top of it (during login and splash)
- Made a custom image-scroller component that shows the current active image
- Memoized bottom sheet components to avoid unnesscessary rerenders
- API calls for user, cart info are made in the splash screen once.
- Product card, Review card, Product summary card etc are made fully through flexbox to assure responsive and consistent UI on different screen sizes


## Tech Stack

**Client:** React Native, Redux ToolKit, Expo

**Server:** Node, Express, Cloudinary, MongoDB

## Backend
https://github.com/usmansalim3/Amazon-Clone-Backend

# Screenshots
![s1](https://github.com/usmansalim3/Amazon-Clone/assets/112751010/5a54c79a-7a68-4f7c-8209-5798ae12c25e)
![s2](https://github.com/usmansalim3/Amazon-Clone/assets/112751010/e7ce3978-5684-49ae-b0ee-d8d4716ab08a)
![S4](https://github.com/usmansalim3/Amazon-Clone/assets/112751010/dff3413f-1365-4fdc-a151-6efe35c78572)
![S5](https://github.com/usmansalim3/Amazon-Clone/assets/112751010/cf2145d3-27a4-4879-bde3-8f9b896ee8ca)
![Screenshot 2024-01-18 210420](https://github.com/usmansalim3/Amazon-Clone/assets/112751010/4fbfaa7d-c74a-461e-a042-7141147deb18)

## Demo
https://github.com/usmansalim3/Amrutam-Task/assets/112751010/e93bf426-9cd3-4e4e-b060-fee96d0cabcd

https://github.com/usmansalim3/Amrutam-Task/assets/112751010/0853a63b-371c-46ec-bc3c-7c85c0195246

https://github.com/usmansalim3/Amrutam-Task/assets/112751010/2c6cc512-e83f-476c-a8c0-e08ef6ce09fb

https://github.com/usmansalim3/Amrutam-Task/assets/112751010/3ec363a2-65d9-4d4b-aa4f-592a38a29394

https://github.com/usmansalim3/Amrutam-Task/assets/112751010/145b8555-1fbe-415a-9893-7c475f0d1a0f


