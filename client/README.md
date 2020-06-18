# Infrapedia Open Source

## Version 2.1.4

- BuyDialog component points field is now using custom api and mapbox places api
- buyMessageFormatter helper function needed to be updated
- Doesn't make sense to have fiberPairs on the sidebar so we removed it
- Blog link on navbar doesn't have to open on a new tab
- Create section was not unlocking submit button

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
