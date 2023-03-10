import routerUser from "./User.route";

const routes = {
  use: (app) => {
    app.use("/api/user",routerUser);
  },
};

export default routes;
