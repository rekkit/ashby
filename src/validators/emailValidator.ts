import Joi, { ValidationResult } from "joi";
import { Validator } from "./validator";
import { VALIDATOR_TYPE } from "./validatorType";

/**
 * Email validator. Checks whether a given string is a valid email.
 */
export class EmailValidator extends Validator<string> {

    constructor() {
        super(VALIDATOR_TYPE.EMAIL)
    }
    
    /**
     * Checks whether a given string is a valid email. 
     * 
     * @param value. The string that we want to validate.
     * @returns true if the given string is an email, false otherwise.
     */
    public isValid(value: string): boolean {
        
        let validationRes: ValidationResult<any> = Joi.string().email().validate(value)
        return validationRes === undefined ? true : false
    }
}
