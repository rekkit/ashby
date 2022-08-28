import { Validator } from "./validator";
import { VALIDATOR_TYPE } from "./validatorType";

/**
 * Validator that checks whether a string contains a substring.
 */
export class TextContainsValidator extends Validator<string> {
    
    queryString: string

    /**
     * 
     * @param queryString. The substring that we're looking for.
     */
	constructor(queryString: string) {
        super(VALIDATOR_TYPE.TEXT_CONTAINS)
        this.queryString = queryString
	}

    /**
     * Checks whether value contains queryString.
     * 
     * @param value. The string that we want to test.
     * @returns true if value contains queryString, false otherwise.
     */
    public isValid(value: string): boolean {
        return value.includes(this.queryString)
    }
}