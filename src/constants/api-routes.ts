let API_ROUTES = {
  PRODUCTS: {
    root: "products",
    GET_ALL_PRODUCTS: "",
    GET_PRODUCT_BY_ID: (id: string) => `${id}`,
  },
  AUTH: {
    root: "auth",
    LOGIN: "login",
  },
};

const controllersArr = Object.entries(API_ROUTES).map(
  ([controllerKey, { root, ...routes }]) => {
    const routesArr = Object.entries(routes);
    const routesPrefixed = Object.fromEntries(
      routesArr.map(([routeKey, route]) => {
        if (typeof route === "function") {
          return [
            routeKey,
            (...params: unknown[]) => {
              const routeValue = (route as (...args: unknown[]) => string)(
                params[0],
              );
              return routeValue ? `${root}/${routeValue}` : root;
            },
          ];
        }
        return [routeKey, route ? `${root}/${route}` : root];
      }),
    );
    return [controllerKey, { ...routesPrefixed, root }];
  },
);

API_ROUTES = Object.fromEntries(controllersArr) as typeof API_ROUTES;

export default API_ROUTES;
