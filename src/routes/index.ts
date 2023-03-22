import routerUser from "./User.route";
import routerMomo from "./Momo.route"

const routes = {
  use: (app) => {
    app.use("/backend/user",routerUser);
    app.use("/backend/momo", routerMomo)
  },
};

export default routes;
