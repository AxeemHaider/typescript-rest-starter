import { IsNotEmpty } from "class-validator";
import { InParams } from "../../utils/Decorators";
import BaseRequestDTO from "./BaseRequest.dto";

class ParamMessageDTO extends BaseRequestDTO {
  @InParams()
  @IsNotEmpty()
  name: string;
}

export default ParamMessageDTO;
