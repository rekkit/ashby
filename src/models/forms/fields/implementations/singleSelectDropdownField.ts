import { FIELD_TYPE } from "../fieldType";
import { SingleSelectDropdownFieldAbstract } from "../abstract/singleSelectDropdownFieldAbstract";
import { ArrayContainsValueValidator } from "../../../../validators/arrayContainsValueValidator";

/**
 * The class that represents a single select dropdown field.
 */
export class SingleSelectDropdownField extends SingleSelectDropdownFieldAbstract<string> {

    /**
     * The constructor.
     * 
     * @param id. The ID of this form field.
     * @param value. The value of this form field. Can be any string that is in the possible values array.
     * @param required. The field that indicates whether value needs to be set or not.
     * @param possibleValues. The array of values that we can choose value from. If value is not from possible values, the validator will return false.
     */
    constructor(
        id: string,
        value: string,
        required: boolean,
        possibleValues: string[]) {

        super(
            id, 
            FIELD_TYPE.SINGLE_SELECT, 
            value, 
            required, 
            possibleValues, 
            [new ArrayContainsValueValidator<string>(possibleValues)])
    }
}
