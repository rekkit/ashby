import { Validator } from "./validator";
import { VALIDATOR_TYPE } from "./validatorType";

/**
 * Validator that checks the min / max length of a string.
 */
export class TextLengthValidator extends Validator<string> {
    
    public minLength: number | null

    public maxLength: number | null

    /**
     * 
     * @param minLength. The min length that the string needs to have. If this is null there is no min length requirement.
     * @param maxLength. The max length that the string needs to have. If this is null there is no max length requirement.
     */
	constructor(minLength: number | null, maxLength: number | null) {
        super(VALIDATOR_TYPE.TEXT_LENGTH)
        this.minLength = minLength
        this.maxLength = maxLength
	}

    /**
     * Checks whether the given string meets the min / max length criteria.
     * 
     * @param value. The string that we're validating.
     * @returns true if the given string meets the min / max length criteria, false otherwise.
     */
    public isValid(value: string): boolean {
        
        if (this.minLength != null && this.minLength > value.length) return false

        if (this.maxLength != null && this.maxLength < value.length) return false

        return true
    }
}