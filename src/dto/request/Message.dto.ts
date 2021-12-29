import { IsNotEmpty } from "class-validator";
import BaseRequestDTO from "./BaseRequest.dto";

/**
 * @openapi
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         text:
 *           type: string
 *           description: Message text.
 */
class MessageDTO extends BaseRequestDTO {
  @IsNotEmpty()
  text: string;
}

export default MessageDTO;
