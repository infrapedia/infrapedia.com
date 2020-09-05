# Infrapedia Open Source

## Version 2.2.9

- Searchbar fixings
  - Dark mode styles weren't being applied
  - Overflowing of ul list fixed
  - Height should be adjusted automatically depending wether the api gave results for places or not
- MapApp page fixings
  - Sometimes owners array is undefined so it can't be passed on to the metadata helper function
  - The "focus-change" event is being triggered with focus being null, so that needed to be catch
  - metadata.json file created for configuration

## Version 2.2.8

- Editor performance issues with using mapbox Draw plugin has been solved.
  - TODO: Editor improvements list.
- Dynamic import of user dashboard routes, with webpack 'named chunks'
- Changing between layouts has changed, we are now using vue-route 'children' property. It reduces the memory usage, and iddle time between route changes

## Version 2.2.7

- Community Market Place "Make Offer" Button
- Legend Panel
- ClS Labels in Editor
- Homepage footer src logo url was incorrect
- CLS input in terrestrials create section
- Known Users in Subsea cables creation section

## Version 2.2.6

- Community Market Place adjustments
- Homepage new layout
- Mobile Drawer links matching Homepage Navbar links
- Full screen search bar component style adjustments

## Version 2.2.5

- Community Market Place

## Version 2.1.4

- BuyDialog component points field is now using custom api and mapbox places api
- buyMessageFormatter helper function needed to be updated
- Doesn't make sense to have fiberPairs on the sidebar so we removed it
- Blog link on navbar doesn't have to open on a new tab
- Create section was not unlocking submit button
- BuyDialog Transit has new field, and Fiber option should be removed on Transit buy
- Fiber pairs needed to be displayed on subsea cables dashboard edit/create section
- Elements names need to accept /

## Version 2.1.3

- buyMessageFormatter helper function for different types of buy request

## Version 2.1.2

- Vuex has been removed from the Editor because it was slowing down the system when using it alongside the mapbox "Draw" plugin

## Version 2.1.1

- Editor helper messages for the editing elements: IXP, CLS, Facilities, Subsea, Terrestrial Networks.

## Version 1.0.0

- Alerts page and services
- Issues page(s) and services

Upload of KMZ for:

- cls
- cables

note: Zoom to bounds of both of them done too

- Dragger component for uploading files

New pages:

- IXPs
- Facilities

Form components for:

- cls
- cables
- networks
- organizations
- facilities

New pages on user route:

- cls
- cables
- networks
- organizations

---

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn dev
```

### Compiles and minifies for production

```
yarn build
```

### Run your unit tests

```
yarn test
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/)
