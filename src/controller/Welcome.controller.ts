import { plainToClass } from "class-transformer";
import { Request, Response } from "express";
import { Service as AutoInjection } from "typedi";
import MessageDTO from "../dto/request/Message.dto";
import validateRequest from "../middleware/requestValidator.middleware";
import { WelcomeService } from "../service/Welcome.service";
import BaseController from "./Base.controller";

@AutoInjection()
class WelcomeController extends BaseController {
  public constructor(private readonly welcomeService: WelcomeService) {
    super();
  }

  protected initializeEndpoints(): void {
    this.addEndpoint("GET", "/welcome", this.welcome);
    this.addEndpoint(
      "GET",
      "/say",
      this.saySomething,
      validateRequest(MessageDTO)
    );
    this.addEndpoint("GET", "/hello-from-repo", this.helloFromRepo);
    this.addEndpoint("GET", "/reply", this.reply, validateRequest(MessageDTO));
    this.addEndpoint("GET", "/error-test", this.errorTest);
  }

  private errorTest = () => {
    this.welcomeService.errorTest();

    return "should not see";
  };

  private reply = (req: Request) => {
    const messageDTO: MessageDTO = plainToClass(MessageDTO, req.query);

    const message = this.welcomeService.reply(messageDTO);

    return message;
  };

  private helloFromRepo = () => {
    const message = this.welcomeService.helloFromRepo();

    return message;
  };

  private welcome = (req: Request, res: Response) => {
    const message = this.welcomeService.hello();

    return message;
  };

  private saySomething = (req: Request, res: Response) => {
    const body: MessageDTO = req.body;

    const message = this.welcomeService.saySomething(body);
    return message;
  };
}

export default WelcomeController;
