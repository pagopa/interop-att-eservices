import { UserServiceDirect } from "./userServiceDirect.js";
import { CoordinatesService } from "./coordinateService.js";
const userServiceDirect = new UserServiceDirect();
const coordinateService = new CoordinatesService();

export { userServiceDirect, coordinateService };
