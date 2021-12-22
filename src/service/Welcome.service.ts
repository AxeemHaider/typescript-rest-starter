import { Service as AutoInjection } from "typedi";
import MessageDTO from "../dto/request/Message.dto";
import WelcomeDTO from "../dto/response/Welcome.dto";
import WelcomeRepo from "../repository/Welcome.repo";

export interface IWelcomeService {
  hello(): WelcomeDTO;
  saySomething(message: MessageDTO): WelcomeDTO;
  helloFromRepo(): Promise<WelcomeDTO>;
  helloToRepo(): Promise<WelcomeDTO>;
  reply(message: MessageDTO): WelcomeDTO;
  errorTest(): string;
}

@AutoInjection()
export class WelcomeService implements IWelcomeService {
  public constructor(private readonly welcomeRepo: WelcomeRepo) {}

  errorTest(): string {
    throw new Error("Error Test");
  }

  reply(message: MessageDTO): WelcomeDTO {
    const welcome = new WelcomeDTO();
    welcome.message = message.text;

    return welcome;
  }

  async helloFromRepo(): Promise<WelcomeDTO> {
    const welcomeEntity = await this.welcomeRepo.getEntity("text");
    const welcome: WelcomeDTO = new WelcomeDTO();
    welcome.message = welcomeEntity.text;

    return welcome;
  }

  async helloToRepo(): Promise<WelcomeDTO> {
    const welcomeEntity = await this.welcomeRepo.saveEntity("text");
    const welcome: WelcomeDTO = new WelcomeDTO();
    welcome.message = welcomeEntity.text;

    return welcome;
  }

  saySomething(message: MessageDTO): WelcomeDTO {
    const welcome: WelcomeDTO = new WelcomeDTO();
    welcome.message = message.text;

    return welcome;
  }

  hello(): WelcomeDTO {
    const welcome: WelcomeDTO = new WelcomeDTO();
    welcome.message = "Hello world!";

    return welcome;
  }
}
