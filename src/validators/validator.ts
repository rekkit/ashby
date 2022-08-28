import { VALIDATOR_TYPE } from "./validatorType";

/**
 * The base validator class.
 */
export abstract class Validator<T> {

    /**
     * The type of the validator. Used for deserialization of JSON values that we get from HTTP requests.
     */
    public validatorType: VALIDATOR_TYPE

    /**
     * 
     * @param validatorType. The type of the validator. Used for deserialization of JSON values that we get from HTTP requests.
     */
    public constructor(validatorType: VALIDATOR_TYPE) {
        this.validatorType = validatorType
    }

    /**
     * The method used to validate the given value.
     * 
     * @param value. The value that we're validating.
     */
    public abstract isValid(value: T): boolean
}
