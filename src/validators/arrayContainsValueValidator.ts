import { Validator } from "./validator";
import { VALIDATOR_TYPE } from "./validatorType";

/**
 * The validator that checks whether an array contains a given value.
 */
export class ArrayContainsValueValidator<T> extends Validator<T> {
    
    public allowedValues: T[] = []

    /**
     * 
     * @param allowedValues. The array of possible values that value can have.
     */
    constructor(allowedValues: T[]) {
        super(VALIDATOR_TYPE.ARRAY_CONTAINS)
        this.allowedValues = allowedValues
    }

    /**
     * Checks whether value falls in allowedValues.
     * 
     * @param value. The value that we want to validate.
     * @returns true if value exists in allowedValues, false otherwise.
     */
    public isValid(value: T): boolean {
        
        for (let i = 0; i < this.allowedValues.length; i++) {
            if (value === this.allowedValues[i]) return true            
        }

        return false
    }
}