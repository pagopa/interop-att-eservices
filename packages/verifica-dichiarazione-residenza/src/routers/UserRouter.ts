import { zodiosRouter } from "@zodios/express";
import UserController from "../controllers/UserController.js";
import { api } from "../model/generated/api.js";
import { createEserviceDataPreparation } from "../exceptions/errorMappers.js";
import { makeApiProblem } from "../exceptions/errors.js";

const userRouter = zodiosRouter(api.api);

userRouter.post("/ar-service-001", async (req, res) => {
  try {
    console.log("post request: " + req.body);
    //RispostaAR001
      const data = await UserController.findUser(
        req.body
      );
      if (data) {
      return res.status(200).json(data).end();
        } else {
          return res.status(500);
        }
      
    }
   catch (error) {
    const errorRes = makeApiProblem(error, createEserviceDataPreparation);
    return res.status(errorRes.status).json(errorRes).end();
  }
});

export default userRouter;
