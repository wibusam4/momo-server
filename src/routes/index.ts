import routerUser from "./User.route";
import routerMomo from "./Momo.route"

const routes = {
  use: (app) => {
    app.use("/api/user",routerUser);
    app.use("/api/momo", routerMomo)
  },
};

export default routes;
