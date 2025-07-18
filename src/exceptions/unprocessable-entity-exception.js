import { UNPROCESSABLE_ENTITY } from "../constants/http-status-codes.js";
import { UNPROCESSABLE_ENTITY as UNPROCESSABLE_ENTITY_MESSAGE } from "../constants/http-status-phrases.js";
import BaseException from "./base-exception.js";
export default class UnprocessableEntityException extends BaseException {
    constructor(message, errData) {
        super(UNPROCESSABLE_ENTITY, message || UNPROCESSABLE_ENTITY_MESSAGE, UNPROCESSABLE_ENTITY_MESSAGE, true, errData);
    }
}
