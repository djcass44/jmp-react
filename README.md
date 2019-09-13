# JMP UI

This README details how to setup the JMP UI and connect it the [JMP API](https://github.com/djcass44/jmp)

If the API has been updated, it is highly recommended to update the UI as they are tightly-coupled and not updating may lead to missing features or potential undefined behaviour.

## Setting up the UI

The JMP UI requires the following environment variables to be set:
* `JMP_API_URL`: the url of the API (default: `localhost:7000`)
* `JMP_API_SECURE`: whether the API is using HTTPS (default: `false`)

The JMP UI can be run in 2 different ways.

1. **Using docker** (recommended)

```bash
docker build -t jmp/ui .
docker run -p 8080:8080 jmp/ui
```

**If using Kubernetes** there is a helm chart available [here](https://github.com/djcass44/jmp-helm). 
This also includes the API backend.

2. **Standalone**

```bash
npm install
npm start
```

The above will serve a non-optimised development build of the UI on `localhost:8080`. 

In order to serve the optimised build, you will need to serve it manually with a web server. This is done automatically in the [Dockerfile](Dockerfile) using NGINX

To create the optimised files:
```bash
npm run build
```
They will be available in the `build` directory

### Custom branding

The JMP UI currently has limited support for custom branding without editing the source.

This can be set by setting the following environment variables:

* `JMP_BRAND_NAME`: name of the application in Navbar and documentation (default: `JMP`)
* `JMP_BRAND_MSG`: subheader shown in Navbar (optional)
* `JMP_BRAND_NOUN`: the name of a Jump (default; "Jump")
* `JMP_BRAND_KEY`: what the application recommends the user set their keyword to (default: `jmp`)