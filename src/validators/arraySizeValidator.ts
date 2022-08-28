import { Validator } from "./validator";
import { VALIDATOR_TYPE } from "./validatorType";

/**
 * Validates array size.
 */
export class ArraySizeValidator<T> extends Validator<T[]> {
    
    public minLength: number | null

    public maxLength: number | null

    /**
     * 
     * @param minLength. The minimum length of the array. If this is null, no minimum length is applied.
     * @param maxLength. The maximum length of the array. If this is null, no maximum length is applied.
     */
    constructor(minLength: number | null, maxLength: number | null) {
        super(VALIDATOR_TYPE.ARRAY_SIZE)
        this.minLength = minLength
        this.maxLength = maxLength
    }

    /**
     * Checks whether the given array meets the min / max length criteria.
     * 
     * @param value. The array that we want to validate.
     * @returns true if the given array meets the min / max length criteria, false otherwise. 
     */
    public isValid(value: T[]): boolean {
        
        if (this.minLength != null && value.length < this.minLength) return false
        if (this.maxLength != null && value.length > this.maxLength) return false

        return true
    }
}